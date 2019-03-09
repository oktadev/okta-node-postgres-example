const express = require('express')
const omdb = require('./omdb')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    if (!req.query.s) throw new Error('Search param (`s`) required')

    res.json(await omdb.search(req.query.s))
  } catch (error) {
    res.json({ error: error.message })
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await omdb.getTitle(req.params.id))
  } catch (error) {
    res.json({ error: error.message })
  }
})

module.exports = router
