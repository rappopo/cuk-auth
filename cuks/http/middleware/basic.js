'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { bcrypt } = cuk.pkg.auth.lib
  const getUser = require('./_get_user')(cuk)
  const detectToken = require('./_detect_token')(cuk)
  const setAuth = require('./_set_auth')(cuk)

  return () => {
    return async (ctx, next) => {
      ctx.auth = ctx.auth || null
      if (!_.isEmpty(ctx.auth)) return next()
      const token = detectToken(ctx, 'basic')
      if (!token) return next()
      const [username, passwd] = Buffer.from(token, 'base64').toString().split(':')
      try {
        const user = await getUser({ site: ctx.state.site.id, username: username })
        if (!bcrypt.compareSync(passwd, user.passwd)) throw helper('core:makeError')({ msg: 'Wrong password', status: 403 })
        ctx.auth = setAuth(user, 'basic')
        return next()
      } catch (e) {
        throw e
      }
    }
  }
}
