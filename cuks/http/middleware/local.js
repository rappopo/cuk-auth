'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib
  const { cfg } = cuk.pkg.auth

  return () => {
    return async (ctx, next) => {
      ctx.auth = ctx.auth || null
      if (!ctx.session) throw helper('core:makeError')('Session unavailable')
      if (ctx.session.auth) {
        ctx.auth = ctx.session.auth
        return next()
      }
      if (ctx.auth) {
        ctx.session.auth = ctx.auth
        return next()
      }
      let redirectTo = cfg.method.local.redirectBeforeSignin || 'auth:get:signin'
      let url = helper('route:url')(redirectTo, ctx)
      ctx.flash.set({ referer: ctx.url })
      ctx.redirect(url)
    }
  }
}
