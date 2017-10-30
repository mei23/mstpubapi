
// StatusX一覧

import StatusBox from '/components/StatusBox'

export default (props) => {
  const stxs = props.stxs
  const host = props.host

  return (
    <div className='status-list'>
      {stxs
        .filter(x => !x.hidden) // 非表示のぞく
        .map(stx => (
          
          // event/original/pend
          stx.event == 'pend' ? (
            <div style={{background:'yellow'}}>表示保留しました</div>
          ) : 

          // event/stream/delete
          stx.event == 'delete' ? (
            <div style={{background:'red'}}>delete {stx.status}</div>
          ) : 

          // event/stream/notification
          stx.event == 'notification' ? (
            <div style={{background:'notification'}}>{JSON.stringify(stx.status)}</div>
          ) : 

          // status
          <StatusBox key={stx.status.id}
            host={host}
            status={stx.status}
            fujo={stx.fujo}
          />
      ))}
    </div>
  )
}

