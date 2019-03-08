require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const { database } = require('./database')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/titles', require('./titles'))
app.use('/services', require('./services'))
app.use('/my-titles', require('./my-titles'))

const port = process.env.SERVER_PORT || 3000

database.sync().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
})
