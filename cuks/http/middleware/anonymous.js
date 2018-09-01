'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return () => {
    return async (ctx, next) => {
      ctx.auth = ctx.auth || null
      if (ctx.session.auth) {
        ctx.auth = ctx.session.auth
      }
      if (_.isEmpty(ctx.auth)) return next()
      ctx.status = 403
      throw helper('core:makeError')({
        status: 500,
        cukStatus: 'anonymous_only',
        msg: 'Stay anonymous! Authenticated user forbidden!'
      })
    }
  }
}
