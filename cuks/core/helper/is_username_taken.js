'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib

  return (site, username) => {
    return new Promise((resolve, reject) => {
      let query = {
        username: username.toLowerCase(),
        site: site
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
