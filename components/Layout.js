import Head from 'next/head'
import '/styles/style.scss'

const Layout = (props) => {
  return (
    <div className='layout'>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Expires" content="0" />
        <title>{props.title || 'mstpubapi'}</title>
      </Head>
      { props.title
        ? <h1><a href='/' target='_self'>mstpubapi</a> / {props.title}</h1>
        : <h1><a href='/' target='_self'>mstpubapi</a></h1>
      }
      {props.children}

      <p><a href="https://github.com/mei23/mstpubapi" target="_blank">ソースコードや説明はこちら</a></p>

    </div>
  )
}

export default Layout;
