import StatusBox from '/components/StatusBox'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      statuses: [],   // list of status
      generateds: [], // list of <StatusBox />
      pendUpdate: false,// pend display update
      retentionLimit: 40,      // max status count
    }

    this.emitter = this.props.emitter

    this.sts = []
    this.gens = []

    this.handlePendUpdateChange = this.handlePendUpdateChange.bind(this)
    this.handleRetentionLimitChange = this.handleRetentionLimitChange.bind(this)

    // add event listener
    if (this.emitter) {

      // init: 受信条件変更
      this.emitter.addListener('init', (newHost) => {
        this.newHost = newHost
        this.sts = []
        this.gens = []

        this.refresh()
      })

      // fill: 初期fill
      this.emitter.addListener('fill', (statuses) => {
        this.sts = statuses
        this.gens = statuses.map(status => <StatusBox key={status.id} status={status} host={this.newHost} hideFooter={true} hideVisibility={true} />)

        this.refresh()
      })

      // status: 新規status受信
      this.emitter.addListener('status', (status) => {
        this.sts.unshift(status)
        this.sts = this.sts.slice(0, this.state.retentionLimit)

        const generated = <StatusBox key={status.id} status={status} host={this.newHost} hideFooter={true} hideVisibility={true} />
        this.gens.unshift(generated)
        this.gens = this.gens.slice(0, this.state.retentionLimit)

        if (!this.state.pendUpdate) {
          this.refresh()
        }
      })
    }
  }

  refresh() {
    this.setState({statuses: this.sts})
    this.setState({generateds: this.gens})
  }

  componentDidMount() {
  }

  handlePendUpdateChange(e) {
    this.setState({pendUpdate: e.target.checked})
    if (!e.target.checked) {
      this.refresh()
    }
  }

  handleRetentionLimitChange(e) {
    this.setState({retentionLimit: e.target.value})
  }

  render() {
    return (
      <div>
        <div style={{display:'flex', flexWrap:'wrap', alignItems:'center'}}>
          <div style={{marginRight:'1em'}}>
            <input type="checkbox" id='pendUpdate' onChange={this.handlePendUpdateChange} value={this.state.pendUpdate} />
            <label htmlFor='pendUpdate'>更新保留</label>
            <style jsx>{`input[type=checkbox], label { cursor: pointer }`}</style>
          </div>
          <div>
            保持件数:
            <input type="number" id='retentionLimit' min={0} max={1000} step={10} onChange={this.handleRetentionLimitChange} value={this.state.retentionLimit}
              style={{width: '4em'}} />
          </div>
        </div>
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

