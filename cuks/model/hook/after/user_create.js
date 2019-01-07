'use strict'

module.exports = function (cuk) {
  return (body, result, opts) => {
    if (!opts.sendActivationMail) return Promise.resolve(true)
    return new Promise((resolve, reject) => {
      // todo: send activation mail
      resolve(true)
    })
  }
}
