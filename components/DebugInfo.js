
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stat: props.show ? 1 : -1
    }
  }

  render() {
    return (
      <div>
        <h3><a onClick={e => this.setState({stat: this.state.stat*=-1})} style={{cursor: 'pointer'}}>
        { this.state.stat > 0 
          ? <span>デバッグ情報非表示</span>
          : <span>デバッグ情報表示</span> }
        </a></h3>
        { this.state.stat > 0 ? this.props.children : '' }
      </div>
    )
  }
}
