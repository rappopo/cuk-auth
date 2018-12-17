'use strict'

module.exports = function (cuk) {
  const { _, helper, config } = cuk.pkg.core.lib
  const cfg = config('auth')

  return (user, method) => {
    let columns = [helper('model:getIdColumn')('auth:user'), 'group_id', 'role']
    columns = _.concat(columns, cfg.exportedColumns.user || [])
    return {
      method: method,
      isAdmin: user.username === cfg.adminUsername,
      user: _.pick(user, columns)
    }
  }
}
