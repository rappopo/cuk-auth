'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { bcrypt } = cuk.pkg.auth.lib
  const { CukModelValidationError } = cuk.pkg.model.lib

  const changePassword = ctx => {
    const body = ctx.request.body
    const model = helper('model:get')('auth:user')
    const idColumn = helper('model:getIdColumn')('auth:user')
    const attribPasswd = _.cloneDeep(model.schema.attributes.passwd)
    let attrib = {
      old_passwd: attribPasswd,
      new_passwd: attribPasswd
    }
    return new Promise((resolve, reject) => {
      model.findOne(ctx.state.auth.user[idColumn])
      .then(user => {
        let valid = helper('model:validateCustom')(_.pick(body, ['old_passwd', 'passwd']), attrib, true)
        if (valid instanceof Error) throw valid
        let err = {}
        if (!bcrypt.compareSync(body.old_passwd, user.data.passwd))
          err.old_passwd = ['mismatch']
        if (!_.isEmpty(err)) throw new CukModelValidationError(err)
        return model.update(ctx.state.auth.user[idColumn], { passwd: body.new_passwd })
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
    method: {
      replaceSelf: changePassword,
      modifySelf: changePassword
    }
  }
}