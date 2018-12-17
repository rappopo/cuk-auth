'use strict'

module.exports = function (cuk) {
  const { _, helper, config } = cuk.pkg.core.lib
  const setAuth = require('../http/middleware/_set_auth')(cuk)

  return [{
    method: 'GET',
    middleware: 'auth:anonymous',
    handler: async ctx => {
      const url = helper('route:url')('auth:post:signin', ctx)
      ctx.render('auth:/signin_form', { url: url, username: ctx.query.username })
    }
  }, {
    method: 'POST',
    middleware: 'auth:anonymous',
    handler: async ctx => {
      const cfg = config('auth')
      try {
        const site = _.get(ctx.state, 'site.code', '*')
        const { username, passwd } = ctx.request.body
        ctx.flash.set(ctx.request.body)
        const user = await helper('auth:getValidUser')(site, username, passwd)
        ctx.session.auth = setAuth(user, 'local')
        const url = helper('route:url')(_.get(cfg, 'method.local.redirectAfterSignin', 'app:get:home'), ctx)
        ctx.redirect(url)
      } catch (e) {
        helper('route:redirectWithError')('auth:get:signin', e, ctx)
      }
    }
  }]
}