const express = require('express')
const { getTitle } = require('./omdb')
const { Title, TitleService, Service } = require('./database')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const full = 'full' in req.query
    const { userId } = req

    const data = await TitleService.findAll({
      attributes: ['id', 'location'],
      where: { '$service.userId$': userId },
      include: [{
        model: Title,
        attributes: ['title']
      }, {
        model: Service,
        attributes: ['id', 'name']
      }]
    })

    res.json(
      data.map(({ id, location, title: { title }, service }) => ({
        id,
        location,
        title: full
          ? title
          : { id: title.imdbID, name: `${title.Title} (${title.Year})` },
        service: { id: service.id, name: service.name }
      }))
    )
  } catch (error) {
    res.json({ error: error.message })
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { titleId, serviceId, location } = req.body

    await Title.upsert({ id: titleId, title: await getTitle(titleId) })

    const { userId } = await Service.findByPk(serviceId)
    if (userId === req.userId) {
      const { id } = await TitleService.create({ titleId, serviceId, location })

      return res.json({ id })
    }
  } catch (error) {
    console.log(error)
  }

  res.json({ error: 'Error adding title' })
})

router.put('/:id', async (req, res, next) => {
  try {
    const { location } = req.body
    const { id } = req.params
    const { userId } = req

    const titleService = await TitleService.findByPk(id, { include: [{ model: Service }] })
    if (titleService && titleService.service.userId === userId) {
      await titleService.update({ location })
      return res.json({ id })
    }
  } catch (error) {
    console.log(error)
  }

  res.json({ error: 'Invalid ID' })
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { userId } = req

    const titleService = await TitleService.findByPk(id, { include: [{ model: Service }] })
    if (titleService && titleService.service.userId === userId) {
      await titleService.destroy()
      res.json({ success: true })
    }
  } catch (error) {
    console.log(error)
  }

  res.json({ error: 'Invalid ID' })
})

module.exports = router
