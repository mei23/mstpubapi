import StatusBox from '/components/StatusBox'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      statuses: [],   // list of status
      generateds: [], // list of <StatusBox />
    }

    this.emitter = this.props.emitter
    this.statusLimit = this.props.limit

    // add event listener
    if (this.emitter) {

      // init: 受信条件変更
      this.emitter.addListener('init', (newHost) => {
        this.setState({statuses: []})
        this.setState({generateds: []})
        this.newHost = newHost
      })

      // fill: 初期fill
      this.emitter.addListener('fill', (statuses) => {
        this.setState({statuses: statuses})

        // DOM生成しておく
        let generateds = statuses.map(status => <StatusBox key={status.id} status={status} host={this.newHost} hideFooter={true} hideVisibility={true} />)
        this.setState({generateds: generateds})
      })

      // status: 新規status受信
      this.emitter.addListener('status', (status) => {
        let statuses = this.state.statuses
        statuses.unshift(status)
        statuses = statuses.slice(0, this.statusLimit)
        this.setState({statuses: statuses})

        const generated = <StatusBox key={status.id} status={status} host={this.newHost} hideFooter={true} hideVisibility={true} />
        
        let generateds = this.state.generateds
        generateds.unshift(generated)
        generateds = generateds.slice(0, this.statusLimit)
        this.setState({generateds: generateds})
      })
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        { this.state.statuses ? 
          <div>
            <div>{this.state.generateds.length} アイテム</div>
            {this.state.generateds}
          </div>
          : '取得中またはエラー'}
      </div>
    )
  }
}

