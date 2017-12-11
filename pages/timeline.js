
import React from 'react'
import Head from 'next/head'
import Layout from '/components/Layout'
import Mastodon from 'mstdn-api'
import StatusBox from '/components/StatusBox'
import AccountDetail from '/components/AccountDetail'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    // read parameters from querystrig or defalt
    this.state.host = this.props.url.query.host || ''
    this.state.type = this.props.url.query.type || 'local'
    this.state.max   = this.props.url.query.max || -1
    this.state.since = this.props.url.query.since || -1

    this.state.message = '' // message
    this.state.statuses = null

    this.submitParams = this.submitParams.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
  }

  componentDidMount(){
    this.refresh(this.state.host, this.state.type, this.state.max, this.state.since)
    //window.onpopstate = (event) => {
    //  this.refresh(this.props.url.query.host, this.props.url.query.id)
    //}
  }

  refresh(newHost, newType, newMax, newSince) {
    if (!newHost) return

    // update current params
    this.setState({host: newHost})
    this.setState({type: newType})
    this.setState({max: newMax})
    this.setState({since: newSince})
    
    this.inputHost.value = newHost
    this.inputType.value = newType
    this.inputMax.value = newMax
    this.inputSince.value = newSince

    // clear fetched object cache
    this.setState({statuses: null})

    this.setState({message: ''})

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
    
    // fetch statuses
    const M = new Mastodon("", newHost)
    M.get(queryUrl, queryPara)
      .catch((reason) => {
        this.setState({message: 'Error in timeline status: ' + JSON.stringify(reason)})
      })
      .then(statuses => {

        // update show status
        this.setState({statuses: statuses})

        // update addressbar
        window.history.pushState({},'',
        `${this.props.url.pathname}?host=${newHost}&type=${newType}&max=${newMax}&since=${newSince}`)
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
              required style={{width: '10em' }} title='インスタンスホスト(例: example.com)' />
            {' '}
            Type:<input type="text" ref={x => this.inputType = x} defaultValue={this.state.type}
              style={{width: '10em' }} title='種類(local=ローカル, fera=連合, その他はタグ扱い)' />(local/fera/タグ)
            {' '}
            Max:<input type="text" ref={x => this.inputMax = x} defaultValue={this.state.max}
              style={{width: '10em' }} title='このIDより前から表示(-1の場合最新から)' />
            {' '}
            Since:<input type="text" ref={x => this.inputSince = x} defaultValue={this.state.since}
              style={{width: '10em' }}  title='このIDの手前まで表示(-1の場合最大件数まで)' />
              
            <button  type="submit">変更反映</button>
          </form>
        </div>

        <div className='current_params'>
          現在 Host: {this.state.host} Type: {this.state.type} Max: {this.state.max} Since: {this.state.since}
        </div>
        {/* <div>{this.state.message}</div> */}
        <div>
          <div className='pager_box' style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right'}}>
            <div style={{ marginRight: 'auto' }}><button onClick={this.moveUp}>新着を表示？</button></div>
            <div><button onClick={this.moveDown}>次を表示</button></div>
          </div>
          { this.state.statuses ? 
            <div>
              <div>{this.state.statuses.length} アイテム</div>
              {this.state.statuses.map(status => <StatusBox status={status} host={this.state.host} />) }
            </div>
            : '未取得またはエラー'}
          <div className='pager_box' style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right'}}>
            <div style={{ marginRight: 'auto' }}></div>
            <div><button onClick={this.moveDown}>次を表示</button></div>
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
