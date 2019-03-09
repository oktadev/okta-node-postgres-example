const session = require('express-session')
const { ExpressOIDC } = require('@okta/oidc-middleware')
const OktaJwtVerifier = require('@okta/jwt-verifier')

const issuer = `${process.env.OKTA_ORG_URL}/oauth2/default`

const initialize = (app, port) => {
  const oidc = new ExpressOIDC({
    issuer,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${port}`,
    scope: 'openid profile'
  })

  app.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: false
  }))
  app.use(oidc.router)

  app.get('/', oidc.ensureAuthenticated(), (req, res) => {
    res.send(req.userContext.tokens.access_token)
  })

  return oidc
}

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer,
  clientId: process.env.OKTA_CLIENT_ID
})

const requireUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (!authorization) throw new Error('You must send an Authorization header')

    const [authType, token] = authorization.split(' ')
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token')

    const { claims: { sub } } = await oktaJwtVerifier.verifyAccessToken(token)
    req.userId = sub
    next()
  } catch (error) {
    res.json({ error: error.message })
  }
}

module.exports = { initialize, requireUser }
