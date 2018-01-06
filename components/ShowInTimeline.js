
// status から timeline に飛べるリンク

import Long from 'long'

export default (props) => {
  const status = props.status
  const host = props.host

  if (!status) return <div></div>

  // 前後IDをUInt64として演算
  const longCur = Long.fromString(status.id.toString(), false)
  const longAsc = longCur.add(1)
  const longDec = longCur.sub(1)
  const strCur = longCur.toString()
  const strAsc = longAsc.toString()
  const strDec = longDec.toString()

  let timelinePath = './timeline'
  if (window.location.pathname.match(/html$/)) { timelinePath = './timeline.html' }

  const hrefOnlyL = `${timelinePath}?host=${host}&type=local&max=${strAsc}&since=${strDec}`
  const hrefDownL = `${timelinePath}?host=${host}&type=local&max=${strAsc}&since=`
  const hrefOnlyF = `${timelinePath}?host=${host}&type=fera&max=${strAsc}&since=${strDec}`
  const hrefDownF = `${timelinePath}?host=${host}&type=fera&max=${strAsc}&since=`

  return (
    <div>
      <div><a href={hrefDownL} target='_self'>ローカルタイムラインでこのステータスと過去を表示</a></div>
      <div><a href={hrefOnlyL} target='_self'>ローカルタイムラインでこのステータスだけを表示</a></div>
      <div><a href={hrefDownF} target='_self'>連合タイムラインでこのステータスと過去を表示</a></div>
      <div><a href={hrefOnlyF} target='_self'>連合タイムラインでこのステータスだけを表示</a></div>
    </div>
  )
}