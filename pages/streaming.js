
import React from 'react'
import HostComponent from '/components/HostComponent'
import Head from 'next/head'
import Layout from '/components/Layout'
import Mastodon from 'mstdn-api'
import * as IDC from '/utils/idcalc'
import querystring from 'querystring'
import * as F from '/utils/formatter'
import DebugInfo from '/components/DebugInfo'
import {EventEmitter} from 'fbemitter'
import StreamStatusList from '/components/StreamStatusList'

export default class extends HostComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.state.message = '' // message

    this.listener = null;
    
    this.submitParams = this.submitParams.bind(this);

    this.emitter = new EventEmitter()
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
    //console.log('isMedia', isMedia)
    //console.log('isNsfw', isNsfw)

    if (mediaOnly && !isMedia) return false
    if (nsfwFilter ==  1 &&  isNsfw) return false
    if (nsfwFilter == -1 && !isNsfw) return false
    return true
  }

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
    
    let queryUrl = null
    let queryPara = {
      limit: 20,
    }
    let streamUrl = null

    let nsfwFilter = 0
    let mediaOnly = false

    if (newType == '') {
      queryUrl = '/api/v1/timelines/public'
      queryPara.local = 'true'
      streamUrl = 'public/local'
    }
    // メディアタイムライン(Pawoo / v2.3.0)
    else if (newType.match(/^local-media(-nsfw|-sfw)?$/)) {
      queryUrl = '/api/v1/timelines/public'
      queryPara.media = 'true'      // Pawoo
      queryPara.only_media = 'true' // v2.3.0
      queryPara.limit = 10
      queryPara.local = 'true'
      streamUrl = 'public/local'
      mediaOnly = true
    }
    else if (newType.match(/^fera-media(-nsfw|-sfw)?$/)) {
      queryUrl = '/api/v1/timelines/public'
      queryPara.media = 'true'
      queryPara.only_media = 'true'
      queryPara.limit = 10
      streamUrl = 'public'
      mediaOnly = true
    }
    else if (newType.match(/^local(-nsfw|-sfw)?$/)) {
      queryUrl = '/api/v1/timelines/public'
      queryPara.local = 'true'
      streamUrl = 'public/local'
    }
    else if (newType.match(/^fera(-nsfw|-sfw)?$/)) {
      queryUrl = '/api/v1/timelines/public'
      // local=false じゃなくてキー自体送っちゃだめっぽい
      streamUrl = 'public'
    }
    else {
      const matchTags = newType.match(/^([^-]+)(-media)?(-nsfw|-sfw)?$/)
      if (matchTags) {
        const tag = matchTags[1]
        queryUrl = `/api/v1/timelines/tag/${tag}`
        streamUrl = `hashtag?tag=${tag}`
        if (matchTags[2]) {
          queryPara.media = 'true' // PawooにはタグメディアTLないけど
          queryPara.only_media = 'true' // v2.3.0
          mediaOnly = true
        }
      }
      else {
        queryUrl = `/api/v1/timelines/tag/${newType}`
        streamUrl = `hashtag?tag=${newType}`
      }
    }

    if (newType.match(/-nsfw$/)) nsfwFilter = -1
    if (newType.match(/-sfw$/))  nsfwFilter =  1

    this.setState({message: `これまでのステータスを取得中... Host: ${newHost}, Path: ${queryUrl}`})

    // fetch statuses
    const M = new Mastodon("", newHost)
    M.get(queryUrl, queryPara)
      .then(statuses => {
        this.setState({message: `これまでのステータスの取得が完了しました Host: ${newHost}, Streaming: ${queryUrl}`})

        // NSFW filter
        statuses = statuses.filter(status => this.checkFilter(status, mediaOnly, nsfwFilter))

        this.emitter.emit('fill', statuses)

        // Setup streaming
        this.setState({message: `Streamingを継続受信中 Host: ${newHost}, Streaming: ${streamUrl}`})

        // close previous listener if exists
        if (this.listener) {
          this.listener.close()
        }

        this.listener = M.stream(streamUrl)
          .on('update', status => {
            // Streaming受信時にMedia/NSFWフィルタ
            if (!this.checkFilter(status, mediaOnly, nsfwFilter)) return

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
        <p>インスタンスのタイムラインを参照＋ストリーミングします</p>
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
        <StreamStatusList emitter={this.emitter} limit={40} />

        <DebugInfo>
          <h4>statuses</h4>
          <div className='json_text'>{JSON.stringify(this.state.statuses)}</div>
        </DebugInfo>
      </Layout>
    )
  }
}
