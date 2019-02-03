'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  const sendActivationMail = (user, ctx) => {
    if (!cuk.pkg.mail) return Promise.resolve(true)
    helper('mail:send')({
      to: `${user.first_name} ${user.last_name} <${user.email}>`,
      from: `${ctx.state.site.pic_name} <${ctx.state.site.pic_email}>`,
      // TODO: mail pkg, format, etc
      subject: ``,
      message: ``
    })
  }

  return {
    middleware: 'auth:anonymous',
    method: {
      create: {
        handler: ctx => {
          const idColUser = helper('model:getIdColumn')('auth:user')
          const idColGroup = helper('model:getIdColumn')('role:group')
          const body = _.get(ctx, 'request.body', {})
          let user = {}
          return new Promise((resolve, reject) => {
            helper('model:find')('role:group', {
              site_id: ctx.state.site.id,
              query: {
                name: 'user'
              },
              limit: 1
            }).then(result => {
              body.group_id = result.data.length > 0 ? result.data[0][idColGroup] : null
              body.active = false
              return helper('model:create')('auth:user', body, {
                site_id: ctx.state.site.id
              })
            }).then(result => {
              user = result.data
              if (!helper('core:config')('auth', 'sendActivationMailOnSignup', false)) return false
              return sendActivationMail(result, ctx)
            }).then(result => {
              const keys = _(body).keys().without('passwd', 'access_token').concat([idColUser, 'created_at', 'updated_at']).value()
              const resp = {
                success: true,
                data: _.pick(user, keys)
              }
              if (result) resp.msg = 'activation_mail_sent'
              resolve(resp)
            }).catch(reject)
          })
        }
      }
    }
  }
}
