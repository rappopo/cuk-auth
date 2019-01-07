'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return {
    middleware: 'auth:anonymous',
    method: {
      create: {
        handler: async (ctx) => {
          const idColUser = helper('model:getIdColumn')('auth:user')
          const idColGroup = helper('model:getIdColumn')('role:group')
          const site = _.get(ctx.state, 'site.code', 'localhost')
          const body = _.get(ctx, 'request.body', {})
          const group = await helper('model:find')('role:group', {
            site: site,
            query: {
              name: 'user'
            },
            limit: 1
          })
          body.group_id = group.data.length > 0 ? group.data[0][idColGroup] : null
          body.active = false
          const result = await helper('model:create')('auth:user', body, {
            site: site,
            sendActivationMail: true
          })
          const keys = _(body).keys().without('passwd', 'access_token').concat([idColUser, 'created_at', 'updated_at']).value()
          return {
            success: true,
            msg: 'activation_mail_sent',
            data: _.pick(result.data, keys)
          }
        }
      }
    }
  }
}
