
export default class  {
  constructor(td) {
    this.td = td || 60
    this.maxArchives = 1000

    this.epoch = new Date().getTime()
    this.lastPeriod = 0
    this.countAll = 0
    this.count = 0
    this.archives = []
  }

  increment() {
    this.countAll++
    this.count++
    
    const prevPeriod = this.lastPeriod
    const currentPeriod = this.getPeriod()
    
    if (prevPeriod !== currentPeriod) {
      this.lastPeriod = currentPeriod
      this.archives.unshift({
        start: this.epoch + (this.td * 1000 * prevPeriod),
        count: this.count,
      })

      this.archives = this.archives.slice(0, this.maxArchives)
      this.count = 0
    }
  }

  getPeriod() {
    return Math.floor((new Date().getTime() - this.epoch) / (this.td*1000))
  }
}