'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return () => {
    return async (ctx, next) => {
      ctx.auth = ctx.auth || null
      if (!_.isEmpty(ctx.auth)) return next()
      throw helper('core:makeError')({
        status: 401,
        msg: 'User authentication required'
      })
    }
  }
}
