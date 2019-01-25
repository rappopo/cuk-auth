'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib
  const idColumn = helper('model:getIdColumn')('auth:user')
  return {
    middleware: ['auth:jwt', 'auth:basic', 'auth:bearer', 'auth:check', { name: 'role:check', skipMissing: true }],
    options: { role: { resourcePossession: 'own' }, idColumn: 'id' },
    method: {
      findOneSelf: async ctx => {
        ctx.state._id = ctx.auth.user[idColumn]
        const result = await helper('rest:modelFindOne')('auth:user')(ctx)
        return result
      },
      replaceSelf: async ctx => {
        ctx.state._id = ctx.auth.user[idColumn]
        const result = await helper('rest:modelReplace')('auth:user')(ctx)
        return result
      },
      modifySelf: async ctx => {
        ctx.state._id = ctx.auth.user[idColumn]
        const result = await helper('rest:modelModify')('auth:user')(ctx)
        return result
      }
    }
  }
}
