
import Head from 'next/head'
import stylesheet from '/styles/style.scss'

export default (props) => {
  const title = props.title || 'Untitled'
  return (
    <div className='layout'>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Expires" content="0" />
        <title>{title}</title>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      </Head>
      <h1>{title}</h1>
      {props.children}
    </div>
  )
}
