'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib

  return (ac) => {
    ac.grant('user')
      .updateOwn('rest:auth:replaceSelf:myPassword')
      .updateOwn('rest:auth:modifySelf:myPassword')
      .readOwn('rest:auth:findOneSelf:myProfile', ['*', '!passwd'])
      .updateOwn('rest:auth:modifySelf:myProfile', ['*', '!passwd'])
      .readOwn('rest:auth:find:myPermission')

    ac.grant('guest')
      .readOwn('rest:auth:findOneSelf:myProfile', ['*', '!group_id', '!access_token', '!passwd', '!role'])
      .readOwn('rest:auth:find:myPermission')

    let access = ac.grant('admin')
      .extend('user')
    helper('role:addRestAccess')(access, 'auth', 'manageUser', ['*', '!passwd'])
  }
}
