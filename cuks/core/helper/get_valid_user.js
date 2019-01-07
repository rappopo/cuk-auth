'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { bcrypt } = cuk.pkg.auth.lib

  return (site, username, passwd) => {
    const { CukModelValidationError } = cuk.pkg.model.lib
    const model = helper('model:get')('auth:user')
    const attrib = _.pick(model.schema.attributes, ['username', 'passwd'])
    return new Promise((resolve, reject) => {
      let valid = helper('model:validateCustom')({
        username: username,
        passwd: passwd
      }, attrib, true)
      if (valid instanceof Error) throw valid
      let query = {
        username: username.toLowerCase(),
        site: site
      }
      model.find({ query: query })
        .then(users => {
          if (users.data.length === 0) throw new CukModelValidationError({ username: ['notFound'] })
          const user = users.data[0]
          if (!user.active) throw helper('core:makeError')('User disabled/inactive')
          if (!bcrypt.compareSync(passwd, user.passwd)) throw new CukModelValidationError({ passwd: ['mismatch'] })
          resolve(user)
        })
        .catch(reject)
    })
  }
}
