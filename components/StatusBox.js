
import UserIcon from '/components/UserIcon'
import AttachmentMedia from '/components/AttachmentMedia'
import * as F from '/utils/formatter'
import Twemoji from 'react-twemoji';
import PreviewCard from '/components/PreviewCard'
import HostComponent from '/components/HostComponent'

/**
 * トゥートヘッダ部分
 */
const StatusHeaderEx = (props) => {

  // toot or boost-info
  const outer = props.status
  // toot or boost-target
  const inner = outer.reblog || outer
  const host = props.host

  let statusPath = './status'
  if (window.location.pathname.match(/html$/)) { statusPath = './status.html' }

  return (
    <div>
      {/* Line 1: status info */} 
      <div style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
        <div style={{ marginRight: 'auto', textAlign: 'left', fontSize: '0.9em' }}>
          <span><a href={`${statusPath}?host=${host}&id=${inner.id}`} title='ローカルでステータス情報を表示する' target='_self'>{inner.id}</a></span>
          {inner.sensitive ? (<span> / Sensitive</span>) : ''}
          
          {props.hideVisibility ? '' : <span> / {inner.visibility}</span>}

          {inner.application ?
             inner.application.website
              ? <span> / <a href={inner.application.website} title='アプリケーションのWebサイトを開く' target='_blank'>
                {inner.application.name}</a></span>
              : <span> / {inner.application.name}</span> : ''}
        </div>

        <div style={{ fontSize: '0.9em' }}>
          <span><a href={inner.url} title='インスタンスのステータスページを開く' target='_blank'>
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

const AvatarBox = (props) => {
  const account = props.account
  const size = props.size > 0 ? props.size : 48
  const radius = Math.floor(size/12)
  const showSts = props.showOptions && props.showOptions.showSts

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
  const showAccountRegisted = props.showOptions && props.showOptions.showAccountRegisted
  const showRelations = props.showOptions && props.showOptions.showRelations
  const c = F.getConvertedContent(status)

  let arriveInfo = ''
  if (status._arrivedDiff) {
    if (status._arrivedDiff < 0) {
      arriveInfo = <span> d:情報なし</span>
    }
    else if (status._arrivedDiff > 1000 * 86400) {
      arriveInfo = <span> d:{Math.floor(status._arrivedDiff / 1000 / 86400)}日前</span>
    }
    else if (status._arrivedDiff > 1000 * 3600) {
      arriveInfo = <span> d:{Math.floor(status._arrivedDiff / 1000 / 3600)}時間前</span>
    }
    else if (status._arrivedDiff > 1000 * 60) {
      arriveInfo = <span> d:{Math.floor(status._arrivedDiff / 1000 / 60)}分前</span>
    }
    else {
      arriveInfo = <span> d:{Math.floor(status._arrivedDiff / 1000)}秒前</span>
    }
  }

  return (
    <div>
      <div className='statusBody'>
        <div>
          <Twemoji>
            <span className='statusBody_displayName'>{F.escapeDF(status.account.display_name)}</span>
            {' '}
            <span className='statusBody_accountName'>@{status.account.acct}</span>
            {showAccountRegisted ?
              <span className='statusBody_accountRegisted'> [{F.toRelactiveString(status.account.created_at)} 
                ({F.formatDateString(status.account.created_at, 'yyyy/m/d')})]
              </span>
              : ''}
            {showRelations ? 
              (status.account.nico_url ? 
                <span className='statusBody_accountRelations'> <a href={status.account.nico_url}>n</a></span> : '')
              : ''}

            {arriveInfo}
            
          </Twemoji>
        </div>
        {status.spoiler_text 
          ? <div className='statusBody_contentWorning'>[CW: {status.spoiler_text}]</div>
          : ''}
        <Twemoji>
          <div className='statusBody_statusContent' dangerouslySetInnerHTML={{
            __html: c
          }} />
        </Twemoji>
        {status.media_attachments.length > 0 ?
          <div style={{ display: 'flex' }}>
            {status.media_attachments.map(att => <AttachmentMedia attachment={att} key={att.id} />)}
          </div> : ''}
      </div>
    </div>
  )
}

const StatusFooterEx = (props) => {
  const status = props.status
  return (
    <div className={'statusFooter'}>
      <span style={{margin:'0em 0.5em'}}>
      BT: {status.reblogs_count}
      </span>
      <span style={{margin:'0em 0.5em'}}>
      ★: {status.favourites_count}
      </span>
    </div>
  )
}

const StatusCard = (props) => {
  const host = props.host
  const status = props.status

  const hasLink = status.content.match(/https?:\/\//)
  const hasMedia = status.media_attachments.length > 0
}

export default class extends HostComponent {
  constructor(props) {
    super(props)
    this.state = {
      card: undefined
    }
  }

  componentDidMount(){
    const outer = this.props.status
    const inner = outer.reblog || outer
    const host = this.props.host

    const hasLink = inner.content.match(/class="invisible">https?/)
    const hasPixivCards = inner.pixiv_cards && inner.pixiv_cards.length > 0

    // media_attachmentsをpixiv_cardから補完
    if (!(inner.media_attachments.length > 0) && hasPixivCards) {
      let dummyId = 2147483648
      const cmp = inner.pixiv_cards.map(c => {
        return {
          id: (++dummyId).toString(),
          type: 'image',
          url: c.image_url,
          remote_url: '',
          preview_url: c.image_url,
          text_url: c.url,
          // meta: 
          description: null,
          _pixiv_cards_completed: true
      }})
      inner.media_attachments = cmp
    }

    // card
    if (this.props.showCard) {
      if (hasLink && !(inner.media_attachments.length > 0)) {
        const M = new Mastodon("", host)
        console.log('try: ' + inner.id)
        M.get(`/api/v1/statuses/${inner.id}/card`)
        .then(card => {
          this.setState({card: card})
        })
        .catch((reason) => {
          console.log('Error in fetch card: ' + JSON.stringify(reason))
        })
      }
    }
  }

  render() {
    const outer = this.props.status
    const inner = outer.reblog || outer
    const host = this.props.host
    const nsfwFilter = this.props.nsfwFilter || 0 // 0=none, 1=filter NSFW, -1=filter SFW
    
    const show = (nsfwFilter == 0)
      || (nsfwFilter > 0 && !inner.sensitive)
      || (nsfwFilter < 0 &&  inner.sensitive)

    let classNameExtra = ''
    if (inner._arrivedDiff) {
      if (inner._arrivedDiff > 3 * 60 * 60 * 1000) {
        classNameExtra = ' status-arrived'
      }
      else if (inner._arrivedDiff < 0) {
        classNameExtra = ' status-arrivedUnknown'
      }
    }

    return (
      <div>
        <div className={'status' + classNameExtra} style={{ display: show ? 'flex' : 'none'}}>
          <div className={'status_right'} style={{ margin:'0.3em'}}>
            <AvatarBox account={inner.account} host={host} size='48' showOptions={this.props.showOptions} />
          </div>
          <div className={'status_left'} style={{ margin:'0.3em', width:'100%'}}>
            <StatusHeaderEx status={outer} host={host} hideVisibility={this.props.hideVisibility} />
            <StatusBodyEx host={host} status={inner} showOptions={this.props.showOptions} />
            {this.state.card ? <PreviewCard card={this.state.card} /> : '' }
            {this.props.hideFooter ? '' : <StatusFooterEx status={inner} />}
          </div>
        </div>
      </div>
    )
  }
}
