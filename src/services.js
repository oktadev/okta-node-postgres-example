const express = require('express')

const { Service } = require('./database')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const { userId } = req
  res.json(await Service.findAll({
    attributes: ['id', 'name'],
    where: { userId }
  }))
})

router.post('/', async (req, res, next) => {
  try {
    const { userId } = req
    const { name } = req.body
    const { id } = await Service.create({ userId, name })
    res.json({ success: true, id })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { userId } = req
    const { id } = req.params
    if (await Service.destroy({ where: { userId, id } })) {
      res.json({ success: true })
    }
  } catch (error) { }

  res.json({ success: false, error: 'Invalid ID' })
})

module.exports = router
