'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { bcrypt } = cuk.pkg.auth.lib

  return (id, body, opts) => {
    const { cfg } = cuk.pkg.auth
    return new Promise((resolve, reject) => {
      if (_.has(body, 'passwd')) {
        body.passwd = bcrypt.hashSync(body.passwd, cfg.bcryptSaltRounds || 10)
        body.access_token = helper('core:makeHash')(_.pick(body, ['username', 'passwd']), cfg.method.bearer.algorithm || 'md5')
      }
      resolve({ body: _.cloneDeep(body) })
    })
  }
}