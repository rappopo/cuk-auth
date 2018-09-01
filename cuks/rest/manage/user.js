'use strict'

module.exports = function (cuk){
  const { _ } = cuk.pkg.core.lib

  return {
    model: 'auth:user',
    middleware: 'auth:jwt, auth:basic, auth:bearer, auth:check, role:check',
    method: 'find, findOne, create, replace, modify, remove'
  }
}