
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
        <p>Mastodonインスタンスのタイムラインやステータス(トゥート)を参照したりします</p>
        <dl>
          <dt><a href="timeline">タイムライン</a></dt>
          <dd>タイムライン（ローカル/連合/タグ）等を参照します</dd>
          <dt><a href="status">ステータス</a></dt>
          <dd>ステータス（トゥート）の様々な情報を参照します</dd>
        </dl>

        <p><a href="https://github.com/mei23/mstpubapi" target="_blank">ソースや説明はこちら</a></p>
        
      </Layout>
    )
  }
}
