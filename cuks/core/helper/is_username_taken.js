'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib

  return (domain, username) => {
    return new Promise((resolve, reject) => {
      let query = {
        username: username.toLowerCase(),
        domain: domain
      }
      helper('model:find')('auth:user', { query: query })
        .then(users => {
          if (users.data.length === 0) resolve(false)
          resolve(true)
        })
        .catch(reject)
    })
  }
}
