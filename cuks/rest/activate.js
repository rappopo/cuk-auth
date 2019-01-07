'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { CukModelValidationError } = cuk.pkg.model.lib

  return {
    middleware: 'auth:anonymous',
    method: {
      create: {
        handler: async (ctx) => {
          const idColumn = helper('model:getIdColumn')('auth:user')
          const body = _.get(ctx, 'request.body', {})
          body.site = _.get(ctx.state, 'site.code', 'localhost')
          let err = {}
          if (_.isEmpty(body.username)) err.username = ['required']
          if (_.isEmpty(body.activation_code)) err.activation_code = ['required']
          if (!_.isEmpty(err)) throw new CukModelValidationError(err)
          const users = await helper('model:find')('auth:user', { query: { username: body.username }, site: body.site })
          if (users.data.length === 0) throw helper('core:makeError')('user_not_found')
          const user = users.data[0]
          if (user.active) throw helper('core:makeError')('user_already_active')
          if (body.activation_code !== user.access_token) throw helper('core:makeError')('invalid_activation_code')
          try {
            const result = await helper('model:update')('auth:user', user[idColumn], { active: true }, { site: body.site })
            return {
              success: true,
              msg: 'user_activated',
              data: _.pick(result, [idColumn, 'created_at', 'updated_at', 'username', 'site', 'email', 'first_name', 'last_name', 'active'])
            }
          } catch (err) {
            throw err
          }
        }
      }
    }
  }
}
