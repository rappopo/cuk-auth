'use strict'

module.exports = function (cuk) {
  const { _, helper, moment } = cuk.pkg.core.lib

  return {
    middleware: 'auth:anonymous',
    method: {
      create: {
        handler: async (ctx) => {
          const idColumn = helper('model:getIdColumn')('auth:user')
          const body = _.get(ctx, 'request.body', {})
          const user = await helper('auth:getValidUser')(
            _.get(ctx.state, 'site.domain', '*'), body.username, body.passwd
          )
          const token = helper('auth:makeJwt')({
            uid: user[idColumn],
            uname: user.username,
            hash: helper('core:makeHash')([user[idColumn], user.username, user.passwd])
          })
          return {
            success: true,
            data: {
              created_at: moment().toISOString(),
              token: token
            }
          }
        }
      }
    }
  }
}