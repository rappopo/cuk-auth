'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const idColumn = helper('model:getIdColumn')('auth:user')
  return {
    middleware: 'auth:jwt, auth:basic, auth:bearer, auth:check, role:check',
    method: {
      findOneSelf: ctx => {
        ctx.state._id = ctx.state.auth.user[idColumn]
        return helper('rest:modelFindOne')('auth:user')(ctx)
      },
      replaceSelf: ctx => {
        ctx.state._id = ctx.state.auth.user[idColumn]
        return helper('rest:modelReplace')('auth:user')(ctx)
      },
      modifySelf: ctx => {
        ctx.state._id = ctx.state.auth.user[idColumn]
        return helper('rest:modelModify')('auth:user')(ctx)
      }
    }
  }
}