
import React from 'react'

export default class HostComponent extends React.Component {
  
  constructor(props) {
    super(props)
  }

  /**
   * Update addressbar
   * @param {string} newAddr 
   */
  updateAddressbar(newAddr) {
    const oldAddr = window.location.pathname + window.location.search
    if (oldAddr != newAddr) {
      if (!oldAddr.match(/[?]/)) {  // on initial adressbar update
        window.history.replaceState({}, '', newAddr) // do not create new history entry
      }
      else {
        window.history.pushState({}, '', newAddr)
      }
    }
  }

}
