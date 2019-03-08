const express = require('express')
const { getTitle } = require('./omdb')
const { Title, TitleService, Service } = require('./database')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const data = await TitleService.findAll({
      attributes: ['id', 'location'],
      where: { '$service.userId$': 'TODO' },
      include: [{
        model: Title,
        attributes: ['title']
      }, {
        model: Service,
        attributes: ['id', 'name']
      }]
    })

    console.log(data)

    res.json(
      data.map(({ id, location, title, service }) => ({
        id,
        location,
        title: title.title,
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
    if (userId === 'TODO') {
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

    if (await TitleService.update({ location }, { where: { userId: 'TODO', id } })) {
      return res.json({ id })
    }
  } catch (error) { }

  res.json({ error: 'Invalid ID' })
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    if (await TitleService.destroy({ where: { userId: 'TODO', id } })) {
      return res.json({ id: null })
    }
  } catch (error) { }

  res.json({ error: 'Invalid ID' })
})

module.exports = router
