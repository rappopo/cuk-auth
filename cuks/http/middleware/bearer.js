'use strict'

module.exports = function (cuk) {
  const { _ } = cuk.pkg.core.lib
  const getUser = require('./_get_user')(cuk)
  const detectToken = require('./_detect_token')(cuk)
  const setAuth = require('./_set_auth')(cuk)

  return () => {
    return async (ctx, next) => {
      ctx.auth = ctx.auth || null
      if (!_.isEmpty(ctx.auth)) return next()
      const token = detectToken(ctx, 'bearer')
      if (!token) return next()
      try {
        const user = await getUser({ site: ctx.state.site.id, access_token: token })
        ctx.auth = setAuth(user, 'bearer')
        return next()
      } catch (e) {
        throw e
      }
    }
  }
}
