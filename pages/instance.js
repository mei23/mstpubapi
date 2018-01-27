
import React from 'react'
import HostComponent from '/components/HostComponent'
import Head from 'next/head'
import Layout from '/components/Layout'
import Mastodon from 'mstdn-api'
import InstanceInfo from '/components/InstanceInfo'
import querystring from 'querystring'
import * as F from '/utils/formatter'

export default class extends HostComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.state.message = '' // message
    this.state.instance = null
    this.state.custom_emojis = null

    this.submitParams = this.submitParams.bind(this);
  }

  onNewUrl() {
    // read parameters from querystrig or defalt
    const q = querystring.parse(window.location.search.replace(/^[?]/, ''))
    this.refresh(q.host || '')
  }

  componentDidMount(){
    addEventListener('popstate', () => this.onNewUrl(), false)
    this.onNewUrl();
  }

  refresh(newHost) {
    if (!newHost) return

    // update current params
    this.setState({host: newHost})
    this.inputHost.value = newHost

    // clear fetched object cache
    this.setState({instance: null})
    this.setState({custom_emojis: null})

    this.updateAddressbar(`${window.location.pathname}?host=${newHost}`)

    const M = new Mastodon("", newHost)

    // fetch instance
    this.setState({message: newHost + ' instance 取得中...'})

    M.get(`/api/v1/instance`)
    .then(instance => {
      this.setState({message: newHost + ' instance 取得完了'})
      this.setState({instance: instance})
      
      // fetch custom_emojis
      this.setState({message: newHost + ' custom_emojis 取得中...'})

      M.get(`/api/v1/custom_emojis`)
      .then(custom_emojis => {
        this.setState({message: newHost + ' custom_emojis 取得完了'})
        this.setState({custom_emojis: custom_emojis})
      })
      .catch((reason) => {
        if (reason && reason.status == 404) {
          this.setState({message: newHost + ' custom_emojis 取得失敗(未対応)'})
        }
        else {
          this.setState({message: newHost + ' custom_emojis 取得失敗'+ JSON.stringify(reason)})
        }
      })

    })
    .catch((reason) => {
      this.setState({message: newHost + ' instance 取得失敗' + JSON.stringify(reason)})
    })
  }
  
  submitParams(event) {
    event.preventDefault()
    this.refresh(this.inputHost.value)
  }

  render() {

    return (
      <Layout title='Instance'>
        <Head>
          <base target='_blank' />
        </Head>
        <p>インスタンス情報を参照します</p>
        <div className='change_form'>
          <form onSubmit={this.submitParams}>
            Host:<input type="text" ref={x => this.inputHost = x} defaultValue={this.state.host}
              required style={{width: '14em' }} name='host' placeholder='例: example.com' title='インスタンスホスト(例: example.com)' />
            <button  type="submit">変更反映</button>
          </form>
        </div>
        <div className='current_params'>
          {this.state.message}
        </div>

        <InstanceInfo instance={this.state.instance} emojis={this.state.custom_emojis} />

        <div style={{display: 'none'}}>
          <h3>JSON</h3>
          <h4>instance</h4>
          <div className='json_text'>{JSON.stringify(this.state.instance)}</div>
          <h4>custom_emojis</h4>
          <div className='json_text'>{JSON.stringify(this.state.custom_emojis)}</div>
        </div>
        </Layout>
    )
  }
}
