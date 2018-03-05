
export default (props) => {
  const card = props.card
  if (!card) return ''
  if (!card.url) return 'このステータスにカードはありません'

  return (
    <div>
      <div>url: {card.url ? <a target='_blank' href={card.url}>{card.url}</a> : '(none)' }</div>
      <div>title: {card.title || '(none)' }</div>
      <div>description: {card.description || '(none)'}</div>
      <div>
        image: 
        {card.image ? 
          <div>
            <a target='_blank' href={card.image}>
              <img src={card.image} className='attachment-image' />
            </a>
          </div> : '(none)'}
      </div>
      <div>html: {card.html || '(none)'}</div>

      <div>type: {card.type || '(none)'}</div>
      <div>author_name: {card.author_name || '(none)'}</div>
      <div>author_url: {card.author_url ? <a target='_blank' href={card.author_url}>{card.author_url}</a> : '(none)' }</div>
      
      <div>width: {card.width || '(none)'}</div>
      <div>height: {card.height || '(none)'}</div>
      <div>provider_name: {card.provider_name || '(none)'}</div>
      <div>provider_url: {card.provider_url ? <a target='_blank' href={card.provider_url}>{card.provider_url}</a> : '(none)' }</div>

      {/*JSON.stringify(card)*/}
    </div>
  )
}