
import React from 'react'
import HostComponent from '/components/HostComponent'
import Head from 'next/head'
import Layout from '/components/Layout'
import Mastodon from 'mstdn-api'
import querystring from 'querystring'
import DebugInfo from '/components/DebugInfo'
import {EventEmitter} from 'fbemitter'
import StreamStatusList from '/components/StreamStatusList'
import tlstPara from '/lib/tlstPara'

export default class extends HostComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.state.message = '' // message
    /** stream listener */
    this.listener = null;
    /** emitter for status update */
    this.emitter = new EventEmitter()

    this.submitParams = this.submitParams.bind(this);

    this.showOptions = {
      showAccountRegisted: true,
      showSts: true,
      showRelations: true,
    }
  }

  onNewUrl() {
    // read parameters from querystrig or defalt
    const q = querystring.parse(window.location.search.replace(/^[?]/, ''))
    this.refresh(q.host || '', q.type || 'local')
  }

  componentDidMount(){
    addEventListener('popstate', () => this.onNewUrl(), false)
    this.onNewUrl();
  }

  /**
   * statusの表示対象判定
   * @param {*} status 
   * @param {boolean} mediaOnly 
   * @param {number} nsfwFilter (1=show sfw only, -1=show nsfw only)
   */
  checkFilter(status, mediaOnly, nsfwFilter) {
    const outer = status
    const inner = outer.reblog || outer

    const isMedia = inner && inner.media_attachments && inner.media_attachments.length > 0 
    const isNsfw = inner && inner.sensitive

    if (mediaOnly && !isMedia) return false
    if (nsfwFilter ==  1 &&  isNsfw) return false
    if (nsfwFilter == -1 && !isNsfw) return false
    return true
  }

  /**
   * refresh(change) fetch condition
   * @param {string} newHost 
   * @param {string} newType 
   */
  refresh(newHost, newType) {
    // update current params
    this.setState({host: newHost})
    this.setState({type: newType})
    
    this.inputHost.value = newHost
    this.inputType.value = newType

    // update addressbar
    this.updateAddressbar(`${window.location.pathname}?host=${newHost}&type=${newType}`)

    this.setState({message: ''})

    this.emitter.emit('init', newHost)

    if (!newHost) return

    const para = tlstPara.create(newType, -1, -1, -1)
    this.setState({message: `これまでのステータスを取得中... Host: ${newHost}, Path: ${para.queryUrl}`})

    // fetch statuses
    const M = new Mastodon("", newHost)
    M.get(para.queryUrl, para.queryPara)
      .then(statuses => {
        this.setState({message: `これまでのステータスの取得が完了しました Host: ${newHost}, Streaming: ${para.queryUrl}`})

        // NSFW filter
        statuses = statuses.filter(status => this.checkFilter(status, para.mediaOnly, para.nsfwFilter))

        this.emitter.emit('fill', statuses)

        // Setup streaming
        this.setState({message: `Streamingを継続受信中 Host: ${newHost}, Streaming: ${para.streamUrl}`})

        // close previous listener if exists
        if (this.listener) {
          this.listener.close()
        }

        this.listener = M.stream(para.streamUrl)
          .on('update', status => {
            // Streaming受信時にMedia/NSFWフィルタ
            if (!this.checkFilter(status, para.mediaOnly, para.nsfwFilter)) return

            this.emitter.emit('status', status)
        })
        .on('error', err => {
          console.error("err", err)
          if (err.status === 401) {
            this.setState({message: 'エラー: このインスタンスはストリーミングに認証が必要なため、自動更新はできません。自動更新を行うにはインスタンスバージョンが v2.1.0以降である必要があります。'})
          }
          else {
            this.setState({message: 'Streamingでエラーが発生しました ' + JSON.stringify(err)})
          }
        })
      })
      .catch((reason) => {
        this.setState({message: 'ステータスの取得でエラーが発生しました ' + JSON.stringify(reason)})
      })
  }
  
  submitParams(event) {
    event.preventDefault()
    this.refresh(this.inputHost.value, this.inputType.value)
  }

  render() {
    return (
      <Layout title='Streaming'>
        <Head>
          <base target='_blank' />
        </Head>
        {/*<div>{JSON.stringify(this.props)}</div>*/}
        <div>インスタンスのタイムラインを参照＋ストリーミングします</div>
        <div className='change_form'>
          <form onSubmit={this.submitParams}>
            <div style={{display:'flex', flexWrap:'wrap', alignItems:'center'}}>
              <div>
                Host:<input type="text" ref={x => this.inputHost = x} defaultValue={this.state.host}
                  required style={{width: '14em' }} name='host' placeholder='例: example.com' title='インスタンスホスト(例: example.com)' />
              </div>
              <div>
                Type:<input type="text" ref={x => this.inputType = x} defaultValue={this.state.type}
                  style={{width: '10em' }} name='type' placeholder='例: local/fera/タグ' title='種類(local=ローカル, fera=連合, local-media=メディア, その他はタグ扱い)' />
              </div>
              <div>
                <button  type="submit">変更反映</button>
              </div>
              <style jsx>{`
                div {
                  margin-right: 1em;
                }
              `}</style>
            </div>
          </form>
        </div>

        <div className='current_params'>
          {this.state.message}
        </div>
        <StreamStatusList emitter={this.emitter} showOptions={this.showOptions} />
        <DebugInfo>
          <h4>statuses</h4>
          <div className='json_text'>{JSON.stringify(this.state.statuses)}</div>
        </DebugInfo>
      </Layout>
    )
  }
}
