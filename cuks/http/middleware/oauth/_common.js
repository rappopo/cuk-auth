'use strict'

module.exports = function (cuk){
  const { _, helper } = cuk.pkg.core.lib

  return opts => {
    let defOpts = helper('core:makeOptions')('http', 'common.middlewareOpts.bodyParser', options)

  }
}