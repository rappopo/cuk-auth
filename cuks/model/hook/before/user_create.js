'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { bcrypt } = cuk.pkg.auth.lib

  return (body, opts) => {
    const { cfg } = cuk.pkg.auth
    return new Promise((resolve, reject) => {
      body.username = body.username.toLowerCase()
      body.passwd = bcrypt.hashSync(body.passwd, cfg.bcryptSaltRounds || 10)
      if (body.active) body.access_token = helper('core:makeHash')(_.pick(body, ['username', 'passwd']), cfg.method.bearer.algorithm || 'md5')
      else body.access_token = helper('core:makeId')(null, 8)
      resolve({ body: _.cloneDeep(body) })
    })
  }
}
