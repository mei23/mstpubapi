const path = require('path')
const glob = require('glob')

module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.(css|scss)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      }
    ,
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader']
      }
    ,
      {
        test: /\.s(a|c)ss$/,
        use: ['babel-loader', 'raw-loader',
          { loader: 'sass-loader',
            options: {
              includePaths: ['styles', 'node_modules']
                .map((d) => path.join(__dirname, d))
                .map((g) => glob.sync(g))
                .reduce((a, c) => a.concat(c), [])
            }
          }
        ]
      }
    )
    return config
  }
  ,
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
}
