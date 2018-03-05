
import * as F from '/utils/formatter'
import Emoji from '/components/Emoji'
import * as UrlUtil from '/utils/urlUtil'

export default (props) => {
  const instance = props.instance
  const emojis = props.emojis
  if (!instance) return <div></div>

  const desc = F.escapeContent(instance.description)
  const timelinePath = UrlUtil.getPagePath('timeline')
  const streamingPath = UrlUtil.getPagePath('streaming')
  const timeleapPath = UrlUtil.getPagePath('timeleap')

  return (
    <div>
      <h2><a href={`https://${instance.uri}`} target='_blank'>{instance.uri}</a> - {instance.title}</h2>

      <div>Version: {instance.version}
        { instance.stats ? 
          <div>
            {instance.stats.user_count} Users, {instance.stats.status_count} Statuses, {instance.stats.domain_count} Domains
          </div> : '' }
      </div>

      <p dangerouslySetInnerHTML={{ __html: desc }} />

      <h3>タイムライン参照</h3>
      <dl>
        <dt style={{marginTop:'1em',fontWeight:'bold'}}>Streaming - 自動更新されます</dt>
        <dd style={{marginLeft:'1em'}}>
          <div>
            <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=local`}><span style={{fontWeight:'bold',fontSize:'1.5em'}}>ローカル</span></a><small> (
                <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=local-sfw`}>閲覧注意除く</a>
                {' / '}
                <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=local-nsfw`}>閲覧注意のみ</a>
              )</small>
          </div>
          <div>
            <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=fera`}>連合</a><small> (
              <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=fera-sfw`}>閲覧注意除く</a>
              {' / '}
              <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=fera-nsfw`}>閲覧注意のみ</a>
            )</small>
          </div>
          メディア ※一部インスタンスのみ
          <div>
            <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=local-media`}>ローカルメディア</a><small> (
              <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=local-media-sfw`}>閲覧注意除く</a>
              {' / '}
              <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=local-media-nsfw`}>閲覧注意のみ</a>
            )</small>
          </div>
          <div>
            <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=fera-media`}>連合メディア</a><small> (
              <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=fera-media-sfw`}>閲覧注意除く</a>
              {' / '}
              <a target='_self' href={`${streamingPath}?host=${instance.uri}&type=fera-media-nsfw`}>閲覧注意のみ</a>
            )</small>
          </div>
        </dd>
        <dt style={{marginTop:'1em',fontWeight:'bold'}}>Timeline - 過去を遡ることができます</dt>
        <dd style={{marginLeft:'1em'}}>
          <div>
            <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=local`}><span style={{fontWeight:'bold',fontSize:'1.5em'}}>ローカル</span></a><small> (
              <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=local-sfw`}>閲覧注意除く</a>
              {' / '}
              <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=local-nsfw`}>閲覧注意のみ</a>
            )</small>
          </div>
          <div>
            <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=fera`}>連合</a><small> (
              <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=fera-sfw`}>閲覧注意除く</a>
              {' / '}
              <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=fera-nsfw`}>閲覧注意のみ</a>
            )</small>
          </div>
          メディア ※一部インスタンスのみ
          <div>
            <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=local-media`}>ローカルメディア</a><small> (
              <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=local-media-sfw`}>閲覧注意除く</a>
              {' / '}
              <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=local-media-nsfw`}>閲覧注意のみ</a>
            )</small>
          </div>
          <div>
            <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=fera-media`}>連合メディア</a><small> (
              <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=fera-media-sfw`}>閲覧注意除く</a>
              {' / '}
              <a target='_self' href={`${timelinePath}?host=${instance.uri}&type=fera-media-nsfw`}>閲覧注意のみ</a>
            )</small>
          </div>
        </dd>
      </dl>

      <h3>カスタム絵文字</h3>
      <p style={{ display: 'flex', flexWrap: 'wrap' }}>
          {emojis ? emojis.map( emoji => <Emoji emoji={emoji} key={emoji.shortcode} /> ) : ''}
      </p>

      <h3>サムネイル</h3>
      <div>{instance.thumbnail ? <img src={instance.thumbnail} style={{maxWidth:'100%'}} /> : ''}</div>
    </div> 
  )
}