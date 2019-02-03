'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib

  return (ac) => {
    ac.grant('user')
      .updateOwn('rest:auth:replaceSelf:myPassword')
      .updateOwn('rest:auth:modifySelf:myPassword')
      .readOwn('rest:auth:findOneSelf:myProfile', ['*', '!passwd', '!site_id'])
      .updateOwn('rest:auth:modifySelf:myProfile', ['*', '!passwd', '!site_id'])
      .readOwn('rest:auth:find:myPermission')

    ac.grant('guest')
      .readOwn('rest:auth:findOneSelf:myProfile', ['*', '!group_id', '!access_token', '!passwd', '!role', '!site_id'])
      .readOwn('rest:auth:find:myPermission')

    let access = ac.grant('admin')
      .extend('user')
    helper('role:addRestAccess')(access, 'auth', 'manageUser', ['*', '!passwd', '!site_id'])
  }
}
