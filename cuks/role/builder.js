'use strict'

module.exports = function (cuk) {
  return (ac) => {
    ac
      .grant('user')
      .updateOwn('rest:myPassword')
      .readOwn('rest:myProfile')
      .updateOwn('rest:myProfile')

      .readOwn('route:myProfile')
      .updateOwn('route:myProfile')
      .readOwn('route:myPassword')
      .updateOwn('route:myPassword')

      .grant('admin')
      .extend('user')
      .createAny('rest:manageUser')
      .readAny('rest:manageUser')
      .updateAny('rest:manageUser')
      .deleteAny('rest:manageUser')

      .createAny('route:manageUser')
      .readAny('route:manageUser')
      .updateAny('route:manageUser')
      .deleteAny('route:manageUser')
  }
}
