'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return (query) => {
    return new Promise((resolve, reject) => {
      let user
      helper('model:find')('auth:user', { query: query }).then(users => {
        if (users.data.length === 0) throw helper('core:makeError')('user_not_found')
        user = users.data[0]
        if (!user.active) throw helper('core:makeError')({ msg: 'user_disabled_or_inactive', status: 403 })
        resolve(user)
      }).catch(reject)
    })
  }
}
