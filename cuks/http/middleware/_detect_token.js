'use strict'

module.exports = function (cuk) {
  const { _, helper, config } = cuk.pkg.core.lib

  return (ctx, type) => {
    const cfg = _.get(config('auth'), 'method.' + type, {})
    let found = false
    let token
    if (cfg.detect.querystring) {
      if (_.get(ctx.request, 'query.' + cfg.detect.querystring)) {
        if (token) found = true
        token = _.get(ctx.request, 'query.' + cfg.detect.querystring)
      }
    }
    if (cfg.detect.body) {
      if (_.get(ctx.request, 'body.' + cfg.detect.body)) {
        if (token) found = true
        token = _.get(ctx.request, 'body.' + cfg.detect.body)
      }
    }
    if (cfg.detect.header) {
      const parts = (ctx.headers.authorization || '').split(' ')
      if (parts.length === 2 && parts[0].toLowerCase() === type) {
        if (token) found = true
        token = parts[1]
      }
    }
    if (!cfg.allowMultiDetect && found) {
      throw helper('core:makeError')({
        msg: 'multiple_token_location_detected',
        status: 400
      })
    }
    return token
  }
}
