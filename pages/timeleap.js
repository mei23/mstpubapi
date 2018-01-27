
import React from 'react'
import HostComponent from '/components/HostComponent'
import Head from 'next/head'
import Layout from '/components/Layout'
import * as IDX from '/utils/idx'
import querystring from 'querystring'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import stylesheet from 'react-datepicker/dist/react-datepicker.css'
import TimeLeapBox from '/components/TimeLeapBox'

export default class extends HostComponent {

  constructor(props) {
    super(props)
    this.state = {
      host: '',
      targetDate: new moment().hour(0).minute(0).second(0).millisecond(0),
      hour: 0,
      min: 0,
      id: -1,
    }
    this.state.dateTime = this.state.targetDate

    this.state.message = 'x' // message

    // bind
    this.handleHostChange = this.handleHostChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleHourChange = this.handleHourChange.bind(this)
    this.handleMinChange = this.handleMinChange.bind(this)

    //this.submitParams = this.submitParams.bind(this);
  }

  initNewUrl() {
    // read parameters from querystrig or defalt
    const q = querystring.parse(window.location.search.replace(/^[?]/, ''))
    this.setState({host: q.host || ''})
  }

  componentDidMount(){
    addEventListener('popstate', () => this.initNewUrl(), false)
    this.initNewUrl();
  }

  // handle
  handleHostChange(e) {
    this.setState({host: e.target.value})
  }
  handleDateChange(moment) {
    this.setState({targetDate: moment})
  }
  handleHourChange(e) {
    this.setState({hour: e.target.value})
  }
  handleMinChange(e) {
    this.setState({min: e.target.value})
  }

  render() {
    const hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
      .map(x => <option value={x} key={x}>{x}</option>)
    const mins = [0,5,10,15,20,25,30,35,40,45,50,55]
      .map(x => <option value={x} key={x}>{x}</option>)
    
    return (
      <Layout title='TimeLeap' width={640}>
        <Head>
          <base target='_blank' />
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        </Head>
        <dl className='input_list'>
          <dt>Host:</dt>
          <dd>
            <input type='text' value={this.state.host} onChange={this.handleHostChange}
            required style={{width: '14em' }} name='host' placeholder='例: example.com' title='インスタンスホスト(例: example.com)' />
          </dd>
          <dt>Date:</dt>
          <dd>
            <DatePicker
              selected={this.state.targetDate}
              onChange={this.handleDateChange}
              dateFormat='YYYY/MM/DD'
              todayButton={"Today"}
              locale="ja-jp" />
          </dd>
          <dt>Time:</dt>
          <dd>
            Hour:
            <select value={this.state.hour} onChange={this.handleHourChange}>{hours}</select>
            Min:
            <select value={this.state.min}  onChange={this.handleMinChange} >{mins}</select>
          </dd>
        </dl>
        
        <TimeLeapBox host={this.state.host} targetDate={this.state.targetDate} hour={this.state.hour} min={this.state.min} />
      </Layout>
    )
  }
}
