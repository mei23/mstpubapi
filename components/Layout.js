
import Head from 'next/head'
import stylesheet from '/styles/style.scss'

export default (props) => {
  return (
    <div className='layout'>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Expires" content="0" />
        <title>{props.title || 'mstpubapi'}</title>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
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
