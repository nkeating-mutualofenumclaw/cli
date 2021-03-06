if (module === require.main) {
  console.log('1..1')
  console.log('ok 1 setup done')
  process.exit(0)
}

var fs = require('graceful-fs')
var path = require('path')
var userconfigSrc = path.resolve(__dirname, 'fixtures', 'config', 'userconfig')
exports.userconfig = userconfigSrc + '-with-gc'
exports.globalconfig = path.resolve(__dirname, 'fixtures', 'config', 'globalconfig')

// if this hasn't been written yet, then do it now.
try {
  fs.statSync(exports.userconfig)
} catch (er) {
  var uc = fs.readFileSync(userconfigSrc)
  var gcini = 'globalconfig = ' + exports.globalconfig + '\n'
  // atomic!
  fs.writeFileSync(exports.userconfig + '.' + process.pid, gcini + uc)
  fs.renameSync(exports.userconfig + '.' + process.pid, exports.userconfig)
}

exports.builtin = path.resolve(__dirname, 'fixtures', 'config', 'builtin')
exports.malformed = path.resolve(__dirname, 'fixtures', 'config', 'malformed')
exports.ucData =
  { globalconfig: exports.globalconfig,
    email: 'i@izs.me',
    'env-thing': 'asdf',
    'init.author.name': 'Isaac Z. Schlueter',
    'init.author.email': 'i@izs.me',
    'init.author.url': 'http://blog.izs.me/',
    'init.version': '1.2.3',
    'npm:publishtest': true,
    '_npmjs.org:couch': 'https://admin:password@localhost:5984/registry',
    'npm-www:nocache': '1',
    nodedir: '/Users/isaacs/dev/js/node-v0.8',
    'sign-git-tag': true,
    message: 'v%s',
    'strict-ssl': false,
    'tmp': path.normalize(process.env.HOME + '/.tmp'),
    _auth: 'dXNlcm5hbWU6cGFzc3dvcmQ=',
    _token:
     { AuthSession: 'yabba-dabba-doodle',
       version: '1',
       expires: '1345001053415',
       path: '/',
       httponly: true } }

// set the userconfig in the env
// unset anything else that npm might be trying to foist on us
Object.keys(process.env).forEach(function (k) {
  if (k.match(/^npm_config_/i)) {
    delete process.env[k]
  }
})
process.env.npm_config_userconfig = exports.userconfig
process.env.npm_config_other_env_thing = '1000'
process.env.random_env_var = 'asdf'
process.env.npm_config__underbar_env_thing = 'underful'
process.env.NPM_CONFIG_UPPERCASE_ENV_THING = '42'
process.env['npm_config_url_//this_is_a_test:_password'] = 'fixes urls and paths'

exports.envData = {
  userconfig: exports.userconfig,
  '_underbar-env-thing': 'underful',
  'uppercase-env-thing': '42',
  'other-env-thing': '1000',
  'url-//this_is_a_test:_password': 'fixes urls and paths'
}
exports.envDataFix = {
  userconfig: exports.userconfig,
  '_underbar-env-thing': 'underful',
  'uppercase-env-thing': 42,
  'other-env-thing': 1000,
  'url-//this_is_a_test:_password': 'fixes urls and paths'
}

var projectConf = path.resolve(__dirname, '..', '.npmrc')
try {
  fs.statSync(projectConf)
} catch (er) {
  // project conf not found, probably working with packed npm
  fs.writeFileSync(projectConf, '')
}

var projectRc = path.join(__dirname, 'fixtures', 'config', '.npmrc')
try {
  fs.statSync(projectRc)
} catch (er) {
  // project conf not found, probably working with packed npm
  fs.writeFileSync(projectRc, 'just = testing')
}
