import * as IDX from '/utils/idx'
import * as UrlUtil from '/utils/urlUtil'

const TimeLeapBox = (props) => {

  const host = props.host

  const dateTime = props.targetDate.clone().hour(props.hour).minute(props.min)
  const id = IDX.getTimeId(dateTime.toDate(), host)

  const timelinePath = UrlUtil.getPagePath('timeline')

  const hrefDownL = `${timelinePath}?host=${host}&type=local&max=${id}`
  const hrefDownF = `${timelinePath}?host=${host}&type=fera&max=${id}`

  return (
    <div>
      <div>対象日時: {dateTime.format()}</div>
      <div>ID: {id} <span style={{color: 'red'}}>{id < 90000000000000000 ? '(v1区間なので分は無視されました)' : '' }</span></div>
      <div><a href={hrefDownL} target='_self'>ローカルタイムラインで表示</a></div>
      <div><a href={hrefDownF} target='_self'>連合タイムラインで表示</a></div>
    </div>
  )
}

export default TimeLeapBox;
