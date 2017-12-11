
import UserIcon from '/components/UserIcon'
import * as F from '/utils/formatter'

/**
 * トゥートヘッダ部分
 */
const StatusHeaderEx = (props) => {

  // toot or boost-info
  const outer = props.status
  // toot or boost-target
  const inner = outer.reblog || outer
  const host = props.host

  return (
    <div>
      {/* Line 1: status info */} 
      <div style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
        <div style={{ marginRight: 'auto' }}>
          <span><a href={`/status?host=${host}&id=${inner.id}`} title='ローカルでステータス情報を表示する' target='_self'>{inner.id}</a></span>
          {inner.sensitive ? (<span> / Sensitive</span>) : ''}
          <span> / {inner.visibility}</span>

          {inner.application ?
             inner.application.website
              ? <span> / <a href={inner.application.website} title='アプリケーションのWebサイトを開く' target='_blank'>
                {inner.application.name}</a></span>
              : <span> / {inner.application.name}</span> : ''}
        </div>

        <div style={{ textAlign: 'right' }}>
          <span><a href={inner.url} title='インスタンスのスターテスページを開く' target='_blank'>
            {F.formatDateString(inner.created_at, 'yyyy/m/d H:MM:ss.l')}</a></span>
        </div>
      </div>

      {/* Line 2: boost info */} 
      {outer.reblog ? (
        <div className=''>
          <span>(Boosted by @{props.status.account.acct}, with id:{props.status.id} at:{F.formatDateString(props.status.created_at, 'm/d H:MM:ss.l')}
          )</span>
        </div>
      ) : ''}

    </div>
  )
}

const MediaBox = (props) => (
  <div>
    {props.mediaAttachments.map(attachment => (
      <span key={attachment.id}>
        <a href={attachment.url}>
          {
            attachment.type === 'image' || attachment.type === 'gifv'
              ? <img className='attachment-image' src={attachment.preview_url} />
            : attachment.type === 'video'
              ? <video className='attachment-video' src={attachment.url} />
              : ''
          }
        </a>
      </span>
    ))}
  </div>
)

const AvatarBox = (props) => {
  const account = props.account
  const size = props.size > 0 ? props.size : 48
  const radius = Math.floor(size/12)
  const showSts = props.showSts
  
  return (
    <div className='avatar-box' style={{'width':`${size}px`}}>
      <UserIcon host={props.host} account={account}
        text={showSts ? account.statuses_count : ''}
        size={48} radius_ifactar={12} anim={0} duration={-1} />
    </div>
  )
}

const StatusBodyEx = (props) => {
  const status = props.status
  const showAccountRegisted = props.showAccountRegisted
  let c = F.escapeContent(status.content)

  return (
    <div>
      <div>
        <div className='status_body_l1'>
          <span className=''>{status.account.display_name}</span>
          {' '}
          <span className=''>@{status.account.acct}</span> {showAccountRegisted ?
            <span className='account_registed'>
              [{F.toRelactiveString(status.account.created_at)} 
              ({F.formatDateString(status.account.created_at, 'yyyy/m/d H:MM')})]
            </span>
            : ''}
        </div>
        {status.spoiler_text 
          ? <div className=''>[CW: {status.spoiler_text}]</div>
          : ''}
        <div className='' dangerouslySetInnerHTML={{
          __html: c
        }} />
        {status.media_attachments.length > 0 ?
          <MediaBox mediaAttachments={status.media_attachments} /> : ''}
      </div>
    </div>
  )
}

const StatusFooterEx = (props) => {
  const status = props.status
  return (
    <div className={'status_footer'}>
      <span style={{margin:'0em 0.5em'}}>l
        BT: {status.reblogs_count}
      </span>
      <span style={{margin:'0em 0.5em'}}>
        ★: {status.favourites_count}
      </span>
    </div>
  )
}

// status
export default (props) => {
  const outer = props.status
  const inner = outer.reblog || outer
  const host = props.host

  return (
    <div>
      <div className={'status'} style={{ display: 'flex' }}>
        <div className={'status_right'} style={{ margin:'0.3em'}}>
          <AvatarBox account={inner.account} host={host} size='48' showSts={false} />
        </div>
        <div className={'status_left'} style={{ margin:'0.3em', width:'100%'}}>
          <StatusHeaderEx status={outer} host={host} />
          <StatusBodyEx host={host} status={inner} showAccountRegisted={false} />
          <StatusFooterEx status={inner} />
        </div>
      </div>
    </div>
  )
}

