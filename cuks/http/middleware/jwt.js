'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { cfg } = cuk.pkg.auth
  const { jwt } = cuk.pkg.auth.lib
  const getUser = require('./_get_user')(cuk)
  const detectToken = require('./_detect_token')(cuk)
  const setAuth = require('./_set_auth')(cuk)

  return () => {
    return async (ctx, next) => {
      ctx.auth = ctx.auth || null
      if (!_.isEmpty(ctx.auth)) return next()
      const idColumn = helper('model:getIdColumn')('auth:user')
      const token = detectToken(ctx, 'jwt')
      if (!token) return next()
      const payload = jwt.verify(token, cfg.method.jwt.secret)
      const user = await getUser({ site: ctx.state.site.id, username: payload.uname })
      const hash = helper('core:makeHash')([user[idColumn], user.username, user.passwd])
      if (payload.hash !== hash) throw helper('core:makeError')({ msg: 'Token expired/invalid', status: 403 })
      ctx.auth = setAuth(user, 'jwt')
      return next()
    }
  }
}
