'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { bcrypt } = cuk.pkg.auth.lib
  const { CukModelValidationError } = cuk.pkg.model.lib

  const changePassword = ctx => {
    const body = ctx.request.body
    const model = helper('model:get')('auth:user')
    const idColumn = helper('model:getIdColumn')('auth:user')
    let attrib = {
      old_passwd: _.cloneDeep(model.schema.attributes.passwd),
      new_passwd: _.cloneDeep(model.schema.attributes.passwd)
    }
    return new Promise((resolve, reject) => {
      model.findOne(ctx.auth.user[idColumn])
        .then(user => {
          let valid = helper('model:validateCustom')(_.pick(body, ['old_passwd', 'new_passwd']), attrib, true)
          if (valid instanceof Error) throw valid
          let err = {}
          if (!bcrypt.compareSync(body.old_passwd, user.data.passwd)) err.old_passwd = ['mismatch']
          if (!_.isEmpty(err)) throw new CukModelValidationError(err)
          return model.update(ctx.auth.user[idColumn], { passwd: body.new_passwd })
        })
        .then(result => {
          resolve({
            success: true
          })
        })
        .catch(reject)
    })
  }

  return {
    middleware: 'auth:jwt, auth:basic, auth:bearer, auth:check, role:check',
    role: {
      resourcePossession: 'own'
    },
    method: {
      replaceSelf: changePassword,
      modifySelf: changePassword
    }
  }
}