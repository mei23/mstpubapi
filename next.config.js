const path = require('path')
const glob = require('glob')

const withSass = require('@zeit/next-sass')

module.exports = withSass({
  exportPathMap: function() {
    return {
      '/instance.html': { page: '/instance' },
      '/timeline.html': { page: '/timeline' },
      '/streaming.html': { page: '/streaming' },
      '/status.html': { page: '/status' },
      '/timeleap.html': { page: '/timeleap' },
      '/silence.html': { page: '/silence' }
    }
  }
  ,
  assetPrefix: './'
})
