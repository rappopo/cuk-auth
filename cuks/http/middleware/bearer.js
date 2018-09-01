'use strict'

module.exports = function (cuk) {
  const { _ } = cuk.pkg.core.lib
  const getUser = require('./_get_user')(cuk)
  const detectToken = require('./_detect_token')(cuk)
  const setAuth = require('./_set_auth')(cuk)

  return () => {
    return async (ctx, next) => {
      ctx.auth = ctx.auth || null
      if (!_.isEmpty(ctx.state.auth)) return next()
      const token = detectToken(ctx, 'bearer')
      if (!token) return next()
      const domain = _.get(ctx, 'state.site.domain', '*')
      try {
        const user = await getUser({ domain: domain, access_token: token })
        ctx.auth = setAuth(user, 'bearer')
        return next()
      } catch (e) {
        throw e
      }
    }
  }
}
