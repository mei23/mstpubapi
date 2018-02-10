
import React from 'react'
import HostComponent from '/components/HostComponent'
import Head from 'next/head'
import Layout from '/components/Layout'
import Mastodon from 'mstdn-api'
import StatusBox from '/components/StatusBox'
import AccountDetail from '/components/AccountDetail'
import querystring from 'querystring'
import * as F from '/utils/formatter'
import Long from 'long'

export default class extends HostComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.state.msg1 = ''
    this.state.msg2 = ''
    this.state.msg3 = ''
    this.state.msg4 = ''
    
    this.state.status = null // fetched object
    this.state.statuses = null // fetched object

    this.submitParams = this.submitParams.bind(this);
  }

  onNewUrl() {
    // read parameters from querystrig or defalt
    const q = querystring.parse(window.location.search.replace(/^[?]/, ''))
    this.refresh(q.host || '', q.id || '')
  }

  componentDidMount(){
    addEventListener('popstate', () => this.onNewUrl(), false)
    this.onNewUrl();
  }

  refresh(newHost, newId) {
    // update current params
    this.setState({host: newHost})
    this.setState({id:   newId})

    this.inputHost.value = newHost
    this.inputId.value = newId

    // update addressbar
    this.updateAddressbar(`${window.location.pathname}?host=${newHost}&id=${newId}`)

    // clear fetched object cache
    this.setState({status: null})
    this.setState({statuses: null})

    this.setState({msg1: ''})
    this.setState({msg2: ''})
    this.setState({msg3: ''})
    this.setState({msg4: '不明'})

    if (!newHost) return
    const M = new Mastodon("", newHost)

    // 該当ステータス取得
    this.setState({msg1: 'ステータス取得中...'})
    M.get(`/api/v1/statuses/${newId}`)
    .then(status => {
      
      // 該当ステータス情報更新
      this.setState({status: status})
      this.setState({msg1: ''})

      // 前提チェック
      if (status.visibility !== 'public') {
        this.setState({msg2: 'publicトゥートではないのでチェックできません、publicトゥートを指定してやり直してください。中断！'})
        return
      }
      else if (status.reblog) {
        this.setState({msg2: 'ブーストなのでチェックできません、トゥートのIDでやり直してください。中断！'})
        return
      }
      else if (status.in_reply_to_id) {
        this.setState({msg2: 'リプライなのでチェックできません、トゥートのIDでやり直してください。中断！'})
        return
      }
      
      else {
        this.setState({msg2: 'ステータス取得＆チェック前提条件OK、チェック継続'})
      }


      // 該当idの前後の取得
      const longCur = Long.fromString(status.id.toString(), false)
      const longAsc = longCur.add(1)
      const longDec = longCur.sub(1)

      const queryUrl = '/api/v1/timelines/public' // 連合TL
      const queryPara = {
        max_id: longAsc.toString(),
        since_id: longDec.toString(),
      }
      
      // 公開タイムライン取得
      this.setState({msg3: '公開タイムライン取得中...'})

      M.get(queryUrl, queryPara)
      .then(statuses => {
        this.setState({statuses: statuses})
        this.setState({msg3: ''})

        if (statuses.length === 1) {
          this.setState({msg4: 'OK: 公開TLにいました、たぶんサイレンスされていません'})
        }
        else if (statuses.length === 0) {
          this.setState({msg4: 'NG: 公開TLにいません、もしかしたらサイレンスされています'})
        }
        else {
          this.setState({msg4: 'チェックエラー、不明'})
        }
      })
      .catch((reason) => {
        this.setState({msg3: '公開タイムラインの取得に失敗しました、チェック中断: ' + JSON.stringify(reason.status || reason)})
      })

    })
    .catch((reason) => {
      this.setState({msg1: 'ステータスの取得に失敗しました、チェック中断: ' + JSON.stringify(reason.status || reason)})
    })

  }
  
  submitParams(event) {
    event.preventDefault()
    this.refresh(this.inputHost.value, this.inputId.value)
  }

  render() {
    return (
      <Layout title='サイレンスチェッカー'>
        <Head>
          <base target='_blank' />
        </Head>
        <p>インスタンスで特定のユーザーがサイレンスされているか調べます</p>
        <div className='change_form'>
          <form onSubmit={this.submitParams}>
            <dl className='input_list'>
              <dt>インスタンスホスト:</dt>
              <dd>
                <input type="text" ref={x => this.inputHost = x} defaultValue={this.state.host}
                  required style={{width: '14em' }} name='host' placeholder='例: example.com' title='インスタンスホスト(例: example.com)' />
              </dd>
              <dt>ステータスID (チェックしたいユーザーのどれか1つの(該当インスタンスでの)トゥートのIDを指定):</dt>
              <dd>
                <input type="text" ref={x => this.inputId   = x} defaultValue={this.state.id}
                  required style={{width: '12em' }} name='id' title='ステータスID' placeholder='例: 99xxxxxxxxxxxxxxx'/>
                
              </dd>
            </dl>
            <button  type="submit">チェック開始</button>
          </form>
        </div>

        <div>
          <h3>Phase1: ステータス取得＆前提条件チェック</h3>
          <div>{this.state.msg1}</div>
          {this.state.status ? <StatusBox status={this.state.status} host={this.state.host} /> : 'まだ取得されていません'}
        </div>

        <p>{this.state.msg2}</p>

        <div>
          <h3>Phase2: 公開タイムライン可視チェック</h3>
          <div>{this.state.msg3}</div>
          <dl>
            <dt>チェック結果：</dt>
            <dd>
              <span style={{ fontSize: '1.3em', color:
                this.state.msg4.match(/^NG/) ? "red" :
                this.state.msg4.match(/^OK/) ? "#0f0" : "white"
              }}>{this.state.msg4}</span>
            </dd>
          </dl>
        </div>
      </Layout>
    )
  }
}
