'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return {
    middleware: ['auth:jwt', 'auth:basic', 'auth:bearer', 'auth:check', { name: 'role:check', skipMissing: true }],
    options: { role: { resourcePossession: 'own' } },
    method: {
      find: {
        handler: async ctx => {
          const { ac } = cuk.pkg.role.lib
          const resources = _.without(ac.getResources(), '$extend')
          const roles = _.without(_.concat(_.get(ctx.auth, 'group.role', []), _.get(ctx.auth, 'user.role', [])), null, undefined, '')
          const actions = ['read', 'create', 'update', 'delete']
          const posessions = ['any', 'own']
          const perms = []

          _.each(roles, role => {
            _.each(resources, rsc => {
              _.each(actions, act => {
                _.each(posessions, pos => {
                  const action = act + _.capitalize(pos)
                  const query = {
                    role: role,
                    resource: rsc,
                    action: action
                  }
                  query._id = helper('core:makeHash')(query)
                  const perm = ac.can(role)[action](rsc)
                  if (perm.granted) {
                    query.attributes = perm.attributes
                    perms.push(query)
                  }
                })
              })
            })
          })
          const schema = {
            name: ctx.state.reqId
          }
          const result = await helper('model:tempDataset')(schema, perms, ctx)
          return result
        }
      }
    }
  }
}
