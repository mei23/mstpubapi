
import React from 'react'
import Head from 'next/head'
import Layout from '/components/Layout'
import Mastodon from 'mstdn-api'
import StatusList from '/components/StatusList'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.state.stxs = []
  }

  componentDidMount() {
    const M = new Mastodon("", "mst-a2.m544.net")
    M.get('/api/v1/timelines/public', { local: true, })
      .then(statuss => {
        const stxs = statuss.map(status => ({ event: 'update', status, }) )
        this.setState({stxs: stxs})
      })
  }

  render(props) {
    return (
      <Layout>
        <Head>
          <link rel='stylesheet' href='../custom/style.css' />
        </Head>
        <div>1</div>
        <StatusList stxs={this.state.stxs} />
      </Layout>
    )
  }
}
