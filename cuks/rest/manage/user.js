'use strict'

module.exports = function (cuk) {
  return {
    model: 'auth:user',
    middleware: ['auth:jwt', 'auth:basic', 'auth:bearer', 'auth:check', { name: 'role:check', skipMissing: true }],
    method: 'find, findOne, create, replace, modify, remove'
  }
}
