
import React from 'react'
import HostComponent from '/components/HostComponent'
import Head from 'next/head'
import Layout from '/components/Layout'
import Mastodon from 'mstdn-api'
import StatusBox from '/components/StatusBox'
import AccountDetail from '/components/AccountDetail'
import querystring from 'querystring'
import ShowInTimeline from '/components/ShowInTimeline'
import * as F from '/utils/formatter'
import DebugInfo from '/components/DebugInfo'

export default class extends HostComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.state.message = '' // message
    this.state.status = null // fetched object
    this.state.context = null
    this.state.reblogged_by = null
    this.state.favourited_by = null

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

    // clear fetched object cache
    this.setState({status: null})
    this.setState({context: null})
    this.setState({reblogged_by: null})
    this.setState({favourited_by: null})

    this.setState({message: ''})

    // fetch status

    const M = new Mastodon("", newHost)
    M.get(`/api/v1/statuses/${newId}`)
      .catch((reason) => {
        this.setState({message: 'Error in fetch status: ' + JSON.stringify(reason)})
      })
      .then(status => {
        this.setState({message: this.state.message + 'status 取得完了'})

        // update show status
        this.setState({status: status})

        // update addressbar
        this.updateAddressbar(`${window.location.pathname}?host=${newHost}&id=${newId}`)
    
        // fetch status context
        if (status && status.id) {
          M.get(`/api/v1/statuses/${newId}/context`)
            .catch((reason) => {
              this.setState({message: 'Error in fetch context: ' + JSON.stringify(reason)})
            })
            .then(context => {
              this.setState({context: context})
            })

          M.get(`/api/v1/statuses/${newId}/reblogged_by`, { limit: 80 })
            .catch((reason) => {
              this.setState({message: 'Error in fetch reblogged_by: ' + JSON.stringify(reason)})
            })
            .then(reblogged_by => {
              this.setState({reblogged_by: reblogged_by})
            })

          M.get(`/api/v1/statuses/${newId}/favourited_by`, { limit: 80 })
            .catch((reason) => {
              this.setState({message: 'Error in fetch favourited_by: ' + JSON.stringify(reason)})
            })
            .then(favourited_by => {
              this.setState({favourited_by: favourited_by})
            })
        }
      })
  }
  
  submitParams(event) {
    event.preventDefault()
    this.refresh(this.inputHost.value, this.inputId.value)
  }

  render() {
    return (
      <Layout title='Status'>
        <Head>
          <base target='_blank' />
        </Head>
        {/*<div>{JSON.stringify(this.props)}</div>*/}
        <p>ステータス（トゥート）の様々な情報を参照します <a href='https://github.com/mei23/mstpubapi#%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9'>
          説明</a></p>

        <div className='change_form'>
          <form onSubmit={this.submitParams}>
            <div style={{display:'flex', flexWrap:'wrap', alignItems:'center'}}>
              <div>
                Host:<input type="text" ref={x => this.inputHost = x} defaultValue={this.state.host}
                  required style={{width: '14em' }} name='host' placeholder='例: example.com' title='インスタンスホスト(例: example.com)' />
              </div>
              <div>
                Id:<input type="text" ref={x => this.inputId   = x} defaultValue={this.state.id}
                  required style={{width: '12em' }} name='id' title='ステータスID' />
              </div>
              <div>
                <button type="submit">変更反映</button>
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
          現在 Host: {this.state.host}, Id: {this.state.id} を表示中
        </div>
        {/* <div>{this.state.message}</div> */}
        <div>
          <h3>ステータス情報</h3>
          {this.state.status ? <StatusBox status={this.state.status} host={this.state.host} /> : 'none'}
        </div>
        <ShowInTimeline status={this.state.status} host={this.state.host} />
        <div>
          <h3>アカウント情報</h3>
          {this.state.status && this.state.status.reblog ? 
            <AccountDetail account={this.state.status.reblog.account} host={this.state.host} showNote={false} /> : ''}
          {this.state.status ? 
            <AccountDetail account={this.state.status.account} host={this.state.host} showNote={false} /> : 'none'}
        </div>

        <div className='ancestors'>
          <h3>ancestors (上方参照)</h3>
          { this.state.context ? 
            <div>
              <div>{this.state.context.ancestors.length} アイテム</div>
              {this.state.context.ancestors
                .map(status => <StatusBox key={status.id} status={status} host={this.state.host} />) }
            </div>
            : '取得中またはエラー'}
        </div>

        <div className='descendants'>
          <h3>descendants (下方参照)</h3>
          { this.state.context ? 
            <div>
              <div>{this.state.context.descendants.length} アイテム</div>
              {this.state.context.descendants
                .map(status => <StatusBox key={status.id} status={status} host={this.state.host} />) }
            </div>
            : '取得中またはエラー'}
        </div>

        <div className='boosters'>
          <h3>ブーストしたアカウント</h3>
          { this.state.reblogged_by ?
            <div>
              <div>{this.state.reblogged_by.length} アイテム</div>
              {this.state.reblogged_by.map(account => 
                <AccountDetail key={account.id} account={account} host={this.state.host} showNote={false} /> )}
            </div>
            : '取得中またはエラー'}
        </div>

        <div className='favters'>
          <h3>お気に入りしたアカウント</h3>
          { this.state.favourited_by ?
            <div>
              <div>{this.state.favourited_by.length} アイテム</div>
              {this.state.favourited_by.map(account => 
                <AccountDetail key={account.id} account={account} host={this.state.host} showNote={false} /> )}
            </div>
            : '取得中またはエラー'}
       </div>

        <DebugInfo>
          <h4>status</h4>
          <div className='json_text'>{JSON.stringify(this.state.status)}</div>
          <h4>context (ancestors / descendants を含む)</h4>
          <div className='json_text'>{JSON.stringify(this.state.context)}</div>
          <h4>reblogged_by (ブースト)</h4>
          <div className='json_text'>{JSON.stringify(this.state.reblogged_by)}</div>
          <h4>favourited_by (お気に入り)</h4>
          <div className='json_text'>{JSON.stringify(this.state.favourited_by)}</div>
        </DebugInfo>
      </Layout>
    )
  }
}
