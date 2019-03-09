require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const { database } = require('./database')
const okta = require('./okta')

const port = process.env.SERVER_PORT || 3000

const app = express()
app.use(cors())
app.use(bodyParser.json())
okta.initialize(app, port)

app.use('/titles', require('./titles'))
app.use('/services', okta.requireUser, require('./services'))
app.use('/my-titles', okta.requireUser, require('./my-titles'))

database.sync().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
})
