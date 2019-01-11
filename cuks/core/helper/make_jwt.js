'use strict'

module.exports = function (cuk) {
  const { helper, _ } = cuk.pkg.core.lib
  const { jwt } = cuk.pkg.auth.lib

  return (data, secret, opts) => {
    const cfg = helper('core:config')('auth', 'method.jwt', {})
    secret = secret || cfg.secret
    opts = opts || _.cloneDeep(cfg.opts)
    if (_.isString(opts.expiresIn)) opts.expiresIn = helper('core:parseUnitOfTime')(opts.expiresIn, true)
    if (_.isString(opts.notBefore)) opts.notBefore = helper('core:parseUnitOfTime')(opts.notBefore, true)
    return jwt.sign(data, secret, opts)
  }
}
