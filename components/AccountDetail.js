import UserIcon from '/components/UserIcon'
import * as F from '/utils/formatter'

const AccountDetail = (props) => {
  const account = props.account
  const showNote = props.showNote
  const showRelations = props.showRelations

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ margin: '0.5em'}}>
        <UserIcon account={account} text='' size={48} anim={0} />
      </div>
      <div style={{ margin: '0.5em'}}>
        <div>
          {F.escapeDF(account.display_name)} (@{account.username}@{props.host})
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
          { showRelations ? 
            <div>
              <span title='oauth_authentications'>
                oa={account.oauth_authentications ? (
                    account.oauth_authentications.length === 0 ? '(未連携)' :
                    JSON.stringify(account.oauth_authentications.map(oa => oa.provider + ':' + oa.uid))
                  ) : '(非該当)'}
              </span>
              {', '}
              <span>
                nico_url={account.nico_url === undefined ? '(非該当)' : account.nico_url === null ? '(未連携)' : account.nico_url}
              </span>
            </div>
            : '' }
        </div>
      </div>
    </div>
  )
}

export default AccountDetail;
