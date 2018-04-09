
const MediaImage = (props) => {
  const attachment = props.attachment
  /*
  let info = ''
  if (attachment.meta && attachment.meta.original) {
    info = `(${attachment.meta.original.size})`
  }
  */
  return (
    <div className={'media'}>
      <a href={attachment.url}>
        <img className={'media_image'} src={attachment.preview_url} />
      </a>
      <br />image{attachment._pixiv_cards_completed ? '(p)' : ''}
    </div>)
}

const MediaGifv = (props) => {
  const attachment = props.attachment

  return (
    <div className={'media'}>
      <a href={attachment.url}>
        {props.hover
          ? <video className={'media_gifv'} src={attachment.url} autoplay='true' loop='true' />
          : <img className={'media_gifv'} src={attachment.preview_url} />
        }
      </a><br />gifv{attachment._pixiv_cards_completed ? '(p)' : ''}
    </div>
    )
}

const MediaVideo = (props) => {
  const attachment = props.attachment
  return (
    <div className={'media'}>
      <a href={attachment.url}>
        <img className={'media_video'} src={attachment.preview_url} />
      </a><br />video{attachment._pixiv_cards_completed ? '(p)' : ''}
    </div>
  )
}

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.mouseOver = this.mouseOver.bind(this)
    this.mouseOut = this.mouseOut.bind(this)
    this.state = {
      hover: false
    }
  }

  componentDidMount() {
  }

  mouseOver() {
    this.setState({hover: true})
  }
  mouseOut() {
    this.setState({hover: false})
  }

  render() {
    const attachment = this.props.attachment
    return (
      <div onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
        {attachment.type == 'image'
          ? <MediaImage attachment={attachment} hover={this.state.hover} />
          : attachment.type == 'gifv'
          ? <MediaGifv attachment={attachment} hover={this.state.hover} />
          : attachment.type == 'video'
          ? <MediaVideo attachment={attachment} hover={this.state.hover} />
          : ''}
      </div>
    )
  }
}

