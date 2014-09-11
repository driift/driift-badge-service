Package.describe({
  summary: 'Provides node-twitter',
  version: '1.0.0'
})

Package.onUse(function (api) {
  api.addFiles('node-twitter.js', 'server')
  api.export('Tweet', 'server')
})

Npm.depends({
  'node-twitter': '0.5.1'
})
