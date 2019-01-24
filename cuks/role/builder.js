'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib

  return (ac) => {
    let access = ac.grant('user')
    access
      .updateOwn('rest:auth:replaceSelf:myPassword')
      .updateOwn('rest:auth:modifySelf:myPassword')
      .readOwn('rest:auth:findOneSelf:myProfile')
      .updateOwn('rest:auth:replaceSelf:myProfile')
      .readOwn('rest:auth:find:myPermission')

    access = ac.grant('admin')
      .extend('user')
    helper('role:addRestAccess')(access, 'auth', 'manageUser')
  }
}
