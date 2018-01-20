
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

      <div><a target='_self' href={`${streamingPath}?host=${instance.uri}&type=local`}>ローカルタイムライン(自動更新付き)</a></div>
      <div><a target='_self' href={`${streamingPath}?host=${instance.uri}&type=fera`}>連合タイムライン(自動更新付き)</a></div>
      <div><a target='_self' href={`${timelinePath}?host=${instance.uri}&type=local`}>ローカルタイムライン(過去遡り付き)</a></div>
      <div><a target='_self' href={`${timelinePath}?host=${instance.uri}&type=fera`}>連合タイムライン(過去遡り付き)</a></div>
      <div><a target='_self' href={`${timeleapPath}?host=${instance.uri}`}>特定時点のタイムラインを参照</a></div>

      <h3>カスタム絵文字</h3>
      <p style={{ display: 'flex', flexWrap: 'wrap' }}>
          {emojis ? emojis.map( emoji => <Emoji emoji={emoji} key={emoji.shortcode} /> ) : ''}
      </p>

      <h3>サムネイル</h3>
      <div>{instance.thumbnail ? <img src={instance.thumbnail} style={{maxWidth:'100%'}} /> : ''}</div>
    </div> 
)
}