'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return [{
    method: 'GET',
    middleware: 'auth:local, auth:check',
    handler: async ctx => {
      const url = helper('route:url')('auth:post:signout', ctx)
      ctx.render('auth:/signout_form', { url: url })
    }
  }, {
    method: 'POST',
    middleware: 'auth:local, auth:check',
    handler: async ctx => {
      const cfg = _.get(cuk.pkg.auth, 'cfg.common', {})
      try {
        ctx.flash.set({ msg: "You've been successfully signed out!"})
        ctx.session.auth = null
        const url = helper('route:url')(_.get(cfg, 'method.local.redirectAfterSignout', 'app:get:home'), ctx)
        ctx.redirect(url)
      } catch (e) {
        throw helper('core:makeError')(e)
      }
    }
  }]
}