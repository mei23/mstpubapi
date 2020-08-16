const Emoji = (props) => {
  const emoji = props.emoji

  return (
    <div>
      <img src={emoji.url} alt={`:${emoji.shortcode}:`} title={`:${emoji.shortcode}:`}
        style={{width:'1em', height:'1em', margin:'0.1em'}} />
    </div>
  )
}

export default Emoji;
