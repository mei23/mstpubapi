import StatusBox from '/components/StatusBox'
import statusStatistics from 'lib/statusStatistics'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      statuses: [],   // list of status
      generateds: [], // list of <StatusBox />
      pendUpdate: false,// pend display update
      retentionLimit: 100,      // max status count
    }

    /** EventEmitter of status receiver */
    this.emitter = this.props.emitter

    /** stautes cache */
    this.sts = []
    /** generated DOMs cache */
    this.gens = []
    /** total received status count */
    this.receivedCount = 0

    this.st60 = new statusStatistics(60)
    this.st300 = new statusStatistics(300)

    this.handlePendUpdateChange = this.handlePendUpdateChange.bind(this)
    this.handleRetentionLimitChange = this.handleRetentionLimitChange.bind(this)
    this.handleScroll = this.handleScroll.bind(this)

    // add event listener
    if (this.emitter) {

      // init: initial or receive condition changed
      this.emitter.addListener('init', (newHost) => {
        this.newHost = newHost
        this.sts = []
        this.gens = []
        this.receivedCount = 0
        this.st60 = new statusStatistics(60)
        this.st300 = new statusStatistics(300)

        this.refresh()
      })

      // fill: initial fill after init
      this.emitter.addListener('fill', (statuses) => {
        this.sts = statuses
        this.gens = statuses.map(status => <StatusBox key={status.id} status={status} host={this.newHost} hideFooter={true} hideVisibility={true} 
          showAccountRegisted={this.props.showAccountRegisted} showSts={this.props.showSts} />)
        this.receivedCount += this.sts.length

        this.refresh()
      })

      // status: status update
      this.emitter.addListener('status', (status) => {
        this.sts.unshift(status)
        this.sts = this.sts.slice(0, this.state.retentionLimit)

        const generated = <StatusBox key={status.id} status={status} host={this.newHost} hideFooter={true} hideVisibility={true}
          showAccountRegisted={this.props.showAccountRegisted} showSts={this.props.showSts} />
        this.gens.unshift(generated)
        this.gens = this.gens.slice(0, this.state.retentionLimit)

        this.receivedCount++

        this.st60.increment()
        this.st300.increment()

        if (!this.state.pendUpdate) {
          this.refresh()
        }
      })
    }
  }

  /**
   * refresh view
   */
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

  handleScroll(e) {
    if (e.target.scrollTop === 0) {
      this.setState({pendUpdate: false})
      this.inputPendUpdate.checked = false
      this.refresh()
    }
    else if (e.target.scrollTop >= 0){
      this.setState({pendUpdate: true})
      this.inputPendUpdate.checked = true
    }
  }

  render() {
    return (
      <div>
        <div style={{display:'flex', flexWrap:'wrap', alignItems:'center'}}>
          <div style={{marginRight:'1em'}}>
            <input type="checkbox" ref={x => this.inputPendUpdate = x} id='pendUpdate' onChange={this.handlePendUpdateChange} value={this.state.pendUpdate} />
            <label htmlFor='pendUpdate'>更新保留</label>
            <style jsx>{`input[type=checkbox], label { cursor: pointer }`}</style>
          </div>
          <div>
            {this.state.generateds.length} / <input type="number" id='retentionLimit' min={0} max={1000} step={10}
              onChange={this.handleRetentionLimitChange} value={this.state.retentionLimit} style={{width: '4em'}} />
          </div>
          <div style={{marginLeft: '1em'}} title='Toot/分 1分平均 (1分前,2分前...)'>
            1m: {this.st60.archives.slice(0, 5).map(x => x.count / 1).join(',')}
          </div>
          <div style={{marginLeft: '1em'}} title='Toot/分 5分平均 (5分前,10分前...)'>
            5m: {this.st300.archives.slice(0, 12).map(x => Math.round(x.count / 5)).join(',')}
          </div>
          
        </div>
        { this.state.statuses ? 
          <div onScroll={this.handleScroll}>
            <div style={{ overflowX: 'hidden', overflowY: 'scroll', height: '800px' }}>
              {this.state.generateds}
            </div>
          </div>
          : '取得中またはエラー'}
      </div>
    )
  }
}

