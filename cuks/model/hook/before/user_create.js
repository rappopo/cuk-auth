'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { bcrypt } = cuk.pkg.auth.lib

  return (body, opts) => {
    const cfg = cuk.pkg.auth.cfg.common
    return new Promise((resolve, reject) => {
      body.username = body.username.toLowerCase()
      body.passwd = bcrypt.hashSync(body.passwd, cfg.bcryptSaltRounds || 10)
      body.access_token = helper('core:makeHash')(_.pick(body, ['username', 'passwd']), cfg.method.bearer.algorithm || 'md5')
      resolve({ body: _.cloneDeep(body) })
    })
  }
}