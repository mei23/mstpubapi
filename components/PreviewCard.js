
export default (props) => {
  const card = props.card
  const mode = props.mode

  if (!card) return ''
  if (!card.url) return (
    <div className='previewcard'>
      <div className='previewcard-body'>
        このステータスにカードはありませんでした
      </div>
    </div>
  )

  if (mode == 'debug') {
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

  return (
    <div className='previewcard'>
      <div className='previewcard-title'>
        <a href={card.url}>{card.title || 'Untitled' }</a>
      </div>
      <div className='previewcard-body'>
        {card.image ? 
          <div>
            <a target='_blank' href={card.url}>
              <img src={card.image} className='previewcard-image' />
            </a>
            <br />{card.description || ''}
          </div>
        : card.description ?
          <span>{card.description}</span>
        : '' }
      </div>
    </div>
  )

}