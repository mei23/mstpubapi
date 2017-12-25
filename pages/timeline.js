
import React from 'react'
import Head from 'next/head'
import Layout from '/components/Layout'
import Mastodon from 'mstdn-api'
import StatusBox from '/components/StatusBox'
import AccountDetail from '/components/AccountDetail'
import * as IDC from '/utils/idcalc'
import * as IDX from '/utils/idx'
import querystring from 'querystring'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    
    this.state.message = '' // message
    this.state.statuses = []

    this.submitParams = this.submitParams.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.moveMax = this.moveMax.bind(this);
    this.moveNow = this.moveNow.bind(this);
  }

  onNewUrl() {
    // read parameters from querystrig or defalt
    const q = querystring.parse(window.location.search.replace(/^[?]/, ''))
    this.refresh(q.host || '', q.type || 'local', q.max || -1, q.since || -1)
  }

  componentDidMount(){
    addEventListener('popstate', () => this.onNewUrl(), false)
    this.onNewUrl();
  }

  refresh(newHost, newType, newMax, newSince) {

    // update current params
    this.setState({host: newHost})
    this.setState({type: newType})
    this.setState({max: newMax})
    this.setState({since: newSince})
    
    this.inputHost.value = newHost
    this.inputType.value = newType
    this.inputMax.value = newMax
    this.inputSince.value = newSince

    // update addressbar
    const oldAddr = window.location.pathname + window.location.search
    const newAddr = `${window.location.pathname}?host=${newHost}&type=${newType}&max=${newMax}&since=${newSince}`
    if (oldAddr != newAddr) {
      if (!oldAddr.match(/[?]/)) {  // on initial adressbar update
        window.history.replaceState({}, '', newAddr) // do not create new history entry
      }
      else {
        window.history.pushState({}, '', newAddr)
      }
    }

    // clear fetched object cache
    this.setState({statuses: null})

    this.setState({message: ''})

    if (!newHost) return
    
    let queryUrl = null
    let queryPara = {
      limit: '40',
    }

    if (newType == '') {
      queryUrl = '/api/v1/timelines/public'
      queryPara.local = 'true'
    }
    else if (newType == 'local') {
      queryUrl = '/api/v1/timelines/public'
      queryPara.local = 'true'
    }
    else if (newType == 'fera') {
      queryUrl = '/api/v1/timelines/public'
      // local=false じゃなくてキー自体送っちゃだめっぽい
    }
    else {
      queryUrl = `/api/v1/timelines/tag/${newType}`
      // local=false じゃなくてキー自体送っちゃだめっぽい
    }

    if (newMax > 0)   queryPara.max_id   = newMax
    if (newSince > 0) queryPara.since_id = newSince

    console.log('queryUrl', queryUrl)
    console.log('queryPara', queryPara)
    
    this.setState({message: `ステータスを取得中... Host: ${newHost}, Path: ${queryUrl}, Para: ${JSON.stringify(queryPara)}`})
    // fetch statuses
    const M = new Mastodon("", newHost)
    M.get(queryUrl, queryPara)
      .then(statuses => {
        // update show status
        this.setState({statuses: statuses})
        this.setState({message: `ステータスを取得しました Host: ${newHost}, Path: ${queryUrl}, Para: ${JSON.stringify(queryPara)}`})
      })
      .catch((reason) => {
        this.setState({message: 'ステータスの取得でエラーが発生しました ' + JSON.stringify(reason)})
      })
    }
  
  submitParams(event) {
    event.preventDefault()
    this.refresh(this.inputHost.value, this.inputType.value, this.inputMax.value, this.inputSince.value)
  }

  moveUp(event) {
    event.preventDefault()

    let since;
    if (this.state.statuses && this.state.statuses.length > 0) {
      // 前回取得成功していて１件以上取得されていたら最上位から
      since = this.state.statuses[0].id
    }
    else {
      // 前回取得失敗 or まだ件数がなかったら
      if (this.state.since > 0) {
        since = this.state.since
      }
      else if (this.state.max > 0) {
        since = this.state.max - 1
      }
      else {
        since = this.state.since
      }
    }

    this.refresh(this.state.host, this.state.type, -1, since)
  }

  moveDown(event) {
    event.preventDefault()
    let max;
    if (this.state.statuses && this.state.statuses.length > 0) {
      // 前回取得成功していて１件以上取得されていたら最後の値から
      max = this.state.statuses[this.state.statuses.length - 1].id
    }
    else {
      // 前回取得失敗 or まだ件数がなかったら
      if (this.state.max > 0) {
        max = this.state.max
      }
      else if (this.state.since > 0) {
        max = this.state.since + 1
      }
      else {
        max = this.state.max
      }
    }
   this.refresh(this.state.host, this.state.type, max, -1)
  }

  /**
   * Maxを指定時間変更して画面更新(Sinceはリセット)
   * @param {*} event 
   * @param {number} sec 移動する秒数
   */
  moveMax(event, sec) {
    event.preventDefault()

    // v1部分を表示中か？
    let isV1 = false
    if (this.state.statuses && this.state.statuses.length > 0) {
      // 表示中のステータスがある場合
      if (this.state.statuses[0].id < 90000000000000000) {
        isV1 = true
      }
    }
    else {
      // 表示中のステータスがないからv1かどうかわからない
    }

    // 計算基準日付(一番上のステータスの日付 || 現在)
    let date = new Date()
    if (this.state.statuses && this.state.statuses.length > 0) {
      const dateStr = this.state.statuses[0].created_at
      date = new Date(dateStr)
    }

    const id = IDX.getShiftedId(date, sec * 1000, isV1, this.state.host)

    if (id == IDX.MURI) {
      this.setState({message: `エラー: v1.x区間 かつ IDテーブルを保持していないため移動できません。この区間では 次ページ または ID直指定のみ利用可能です。`})
    }
    else if (id == IDX.TOO_CLOSE) {
      this.setState({message: `エラー: v1.x区間 では1時間以上の単位でのみ移動可能です。`})
    }
    else {
      this.refresh(this.state.host, this.state.type, id, -1)
    }
  }

  moveNow(event) {
    event.preventDefault()
    this.refresh(this.state.host, this.state.type, -1, -1)
  }

  /**
   * 現在表示中のTLから時間移動可能か(0=不可能確定, 1=多分可能)
   * @returns {number}
   */
  canTimeShift() {
    if (this.state.statuses && this.state.statuses.length > 0 && this.state.statuses[0].id < 90000000000000000) {
      return 0
    }
    return 1
  }

  render() {
    return (
      <Layout title='タイムライン'>
        <Head>
          <link rel='stylesheet' href='../custom/style.css' />
          <base target='_blank' />
        </Head>
        {/*<div>{JSON.stringify(this.props)}</div>*/}
        <p>各タイムラインを参照します <a href='https://github.com/mei23/mstpubapi/blob/master/README.md#%E3%82%BF%E3%82%A4%E3%83%A0%E3%83%A9%E3%82%A4%E3%83%B3'>
          説明</a></p>
        <div className='change_form'>
          <form onSubmit={this.submitParams}>
            Host:<input type="text" ref={x => this.inputHost = x} defaultValue={this.state.host}
              required style={{width: '14em' }} title='インスタンスホスト(例: example.com)' />
            {' '}
            Type:<input type="text" ref={x => this.inputType = x} defaultValue={this.state.type}
              style={{width: '10em' }} title='種類(local=ローカル, fera=連合, その他はタグ扱い)' />(local/fera/タグ)
            {' '}
            <br />
            Max:<input type="text" ref={x => this.inputMax = x} defaultValue={this.state.max}
              style={{width: '12em' }} title='このIDより前から表示(-1の場合最新から)' />
            {' '}
            Since:<input type="text" ref={x => this.inputSince = x} defaultValue={this.state.since}
              style={{width: '12em' }}  title='このIDの手前まで表示(-1の場合最大件数まで)' />
              
            <button  type="submit">変更反映</button>
          </form>
        </div>

        <div className='current_params'>
          {this.state.message}
        </div>
        <div>
          {/* Pager top */}
          <div className='pager_box' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
            <div style={{ marginRight: 'auto' }}>
              <button onClick={this.moveUp} title='新着のみを表示します'>新着</button></div>
            <div style={{ marginRight: 'auto' }}>
              <button onClick={this.moveNow} title='最新からの表示に戻ります'>最新に戻る</button></div>
            <div className={'timeshift_box '} style={{textAlign: 'right', marginRight: '10px' }}>
              <div>
                未来へ移動: 
                <a className='move_link' onClick={e => this.moveMax(e, 60*1)}>1分</a>/
                <a className='move_link' onClick={e => this.moveMax(e, 60*10)}>10分</a>/
                <a className='move_link' onClick={e => this.moveMax(e, 3600*1)}>1時間</a>/
                <a className='move_link' onClick={e => this.moveMax(e, 3600*6)}>6時間</a>/
                <a className='move_link' onClick={e => this.moveMax(e, 86400*1)}>1日</a>/
                <a className='move_link' onClick={e => this.moveMax(e, 86400*7)}>7日</a>/
                <a className='move_link' onClick={e => this.moveMax(e, 86400*30)}>30日</a>
              </div>
              <div>
                過去へ移動: 
                <a className='move_link' onClick={e => this.moveMax(e, -60*1)}>1分</a>/
                <a className='move_link' onClick={e => this.moveMax(e, -60*10)}>10分</a>/
                <a className='move_link' onClick={e => this.moveMax(e, -3600)}>1時間</a>/
                <a className='move_link' onClick={e => this.moveMax(e, -3600*6)}>6時間</a>/
                <a className='move_link' onClick={e => this.moveMax(e, -86400*1)}>1日</a>/
                <a className='move_link' onClick={e => this.moveMax(e, -86400*7)}>7日</a>/
                <a className='move_link' onClick={e => this.moveMax(e, -86400*30)}>30日</a>
              </div>
            </div>
            <div><button onClick={this.moveDown} title='表示中のステータスの次のページを表示します'>次ページ</button></div>
          </div>

          { this.state.statuses ? 
            <div>
              <div>{this.state.statuses.length} アイテム</div>
              {this.state.statuses.map(status => <StatusBox key={status.id} status={status} host={this.state.host} />) }
            </div>
            : '取得中またはエラー'}
          <div className='pager_box' style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right'}}>
            <div style={{ marginRight: 'auto' }}></div>
            <div><button onClick={this.moveDown} title='表示中のステータスの次のページを表示します'>次ページ</button></div>
            </div>
        </div>

        <div>
          <h3>JSON</h3>
          <h4>statuses</h4>
          <div className='json_text'>{JSON.stringify(this.state.statuses)}</div>
        </div>
      </Layout>
    )
  }
}
