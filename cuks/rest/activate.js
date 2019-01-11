'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { CukModelValidationError } = cuk.pkg.model.lib

  const sendWelcomeMail = (user, ctx) => {
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
          const idCol = helper('model:getidCol')('auth:user')
          const body = _.get(ctx, 'request.body', {})
          body.site = ctx.state.site.id
          let err = {}
          let user = {}
          if (_.isEmpty(body.username)) err.username = ['required']
          if (_.isEmpty(body.activation_code)) err.activation_code = ['required']
          if (!_.isEmpty(err)) throw new CukModelValidationError(err)
          return new Promise((resolve, reject) => {
            helper('model:find')('auth:user', {
              query: {
                username: body.username
              },
              site: body.site
            }).then(result => {
              if (result.data.length === 0) throw helper('core:makeError')('user_not_found')
              user = result.data[0]
              if (user.active) throw helper('core:makeError')('user_already_active')
              if (body.activation_code !== user.access_token) throw helper('core:makeError')('invalid_activation_code')
              return helper('model:update')('auth:user', user[idCol], {
                active: true,
                access_token: helper('core:makeHash')(_.pick(user, ['username', 'passwd']), helper('core:config')('auth', '.method.bearer.algorithm', 'md5'))
              }, {
                site: body.site
              })
            }).then(result => {
              user = result.data
              if (!helper('core:config')('auth', 'sendWelcomeMailOnActivation', false)) return false
              return sendWelcomeMail(result, ctx)
            }).then(result => {
              resolve({
                success: true,
                msg: 'user_activated',
                data: _.pick(user, [idCol, 'created_at', 'updated_at', 'username', 'site', 'email', 'first_name', 'last_name', 'active'])
              })
            }).catch(reject)
          })
        }
      }
    }
  }
}
