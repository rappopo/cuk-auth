'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib

  return (query) => {
    return new Promise((resolve, reject) => {
      helper('model:find')('auth:user', { query: query })
        .then(users => {
          if (users.data.length === 0) throw helper('core:makeError')('User not found')
          const user = users.data[0]
          if (!user.active) throw helper('core:makeError')({ msg: 'User disabled/inactive', status: 403 })
          resolve(user)
        })
        .catch(reject)
    })
  }
}
