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
          if (!_.isEmpty(err)) throw new CukModelValidationError(err)
          const users = await helper('model:find')('auth:user', { query: { username: body.username }, site: body.site })
          if (users.data.length === 0) throw helper('core:makeError')('user_not_found')
          const user = users.data[0]
          const tmpPasswd = helper('core:makeId')(null, 8)
          try {
            const result = await helper('model:update')('auth:user', user[idColumn], {
              passwd: tmpPasswd
            }, { site: body.site })
            console.log(tmpPasswd)
            // todo: send email
            return {
              success: true,
              msg: 'password_reset_and_sent_to_email',
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
