
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stat: props.show ? 1 : -1,
      show: props.open || '開く',
      hide: props.close || '閉じる',
    }
  }

  render() {
    return (
      <div>
        <div><a onClick={e => this.setState({stat: this.state.stat*=-1})} style={{cursor: 'pointer'}}>
        { this.state.stat > 0 
          ? <span>{this.state.hide}</span>
          : <span>{this.state.show}</span> }
        </a></div>
        { this.state.stat > 0 ? this.props.children : '' }
      </div>
    )
  }
}
