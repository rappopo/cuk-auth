'use strict'

module.exports = function (cuk) {
  return {
    id: 'auth',
    level: 7,
    lib: {
      jwt: require('jsonwebtoken'),
      bcrypt: require('bcrypt')
    }
  }
}
