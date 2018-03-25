
// host: mstdn host
// account: Account object

// size: in px (optional, default:48)
// radius_ifactar: 2:正円 - 12:角丸

// anim: アニメーションする？ (optional, default:0)
// -1:never(しない), 0:onHover(Hover時のみ), 1:allways(常にする)

// duration: onHover時でも初回時にアニメーションする時間(ms)

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.mouseOver = this.mouseOver.bind(this)
    this.mouseOut = this.mouseOut.bind(this)

    this.anim = this.props.anim || 0
    this.duration = this.props.duration || 0
    this.radius_ifactar = this.props.radius_ifactar || 12

    this.state = {
      hover: false
    }
  }

  componentDidMount() {
    if (this.duration > 0) {
      this.setState({hover: true})
      setTimeout(
        function() { this.setState({hover: false}) }.bind(this),
        this.duration);
    }
  }
  mouseOver() {
    this.setState({hover: true})
  }
  mouseOut() {
    this.setState({hover: false})
  }

  getAbsUrl(host, url) {
    if (!url) { return '' }
    return url.match(/^http/) ? url : `https://${host}${url}`
  }

  render() {
    const acc = this.props.account
    const host = this.props.host
    const text = this.props.text
    const size = this.props.size > 0 ? this.props.size : 48
    const radius = Math.floor(size/this.radius_ifactar)

    const urlStatic  = this.getAbsUrl(host, acc.avatar_static)
    const urlDynamic = this.getAbsUrl(host, acc.avatar)
    const urlOut   = 1 <= this.anim ? urlDynamic : urlStatic
    const urlHover = 0 <= this.anim ? urlDynamic : urlStatic

    return (
      <a href={acc.url} title={acc.display_name + (text ? ' ('+text+')' : '')}
       target='_blank'>
        <div
          onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}
          style={{
            width: `${size}px`, height: `${size}px`, 
            borderRadius: `${radius}px`,
            backgroundImage: (this.state.hover
              ? 'url(' + urlHover + ')'
              : 'url(' + urlOut + ')'),
            backgroundSize: `${size}px`,
            display: 'table-cell',
            verticalAlign: 'bottom',
        }}>
          <div className='userIcon-text' style={{
            width: `${size}px`, position: 'relative', top: '17px', textAlign: 'right'}}>{text}</div>
        </div>
      </a>
    )
  }
}

