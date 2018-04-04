
export default class  {
  constructor() {
    this.users = {}
  }

  push(account) {
    if ((account && account.id > 0) == false) return

    const current = new Date().getTime()

    if (this.users[account.id]) {
      const last = this.users[account.id].lastArrived
      this.users[account.id].lastArrived = current
      return current - last
    }
    else {
      this.users[account.id] = {
        lastArrived: current
        //account: account
      }
      return -1
    }
  }
}