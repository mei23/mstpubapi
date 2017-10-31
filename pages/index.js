
import React from 'react'
import Head from 'next/head'
import Layout from '/components/Layout'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
  }

  render(props) {
    return (
      <Layout title='mstpubapi'>
        <dl>
          <dt><a href="status">status</a></dt>
          <dd>status</dd>
          <dt><a href="timeline">timeline</a></dt>
          <dd>timeline</dd>
        </dl>
      </Layout>
    )
  }
}
