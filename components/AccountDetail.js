
import UserIcon from '/components/UserIcon'
import * as F from '/utils/formatter'

export default (props) => {
  const account = props.account
  const showNote = props.showNote

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ margin: '0.5em'}}>
        <UserIcon account={account} text='' size={48} anim={0} />
      </div>
      <div style={{ margin: '0.5em'}}>
        <div>
          {account.display_name} (@{account.username}@{props.host})
        </div>
        <div>
        投稿={account.statuses_count}, 
        フォロワー={account.followers_count}, 
        フォロー={account.following_count}, 
      </div>
      <div>
        id={account.id}, 
        登録={F.formatDateString(account.created_at, 'yyyy/mm/dd HH:MM:ss.l')}
        ({F.toRelactiveString(account.created_at)})
        { showNote ?
          <div className='account_note'>
            <hr />
            <div className='' dangerouslySetInnerHTML={{
              __html: F.escapeContent(account.note)
            }} />
          </div>
          : '' }
      </div>
      </div>
    </div>
  )
}