const Sequelize = require('sequelize')

const database = new Sequelize({
  database: 'movie_catalog',
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op
})

const Service = database.define('service', {
  userId: Sequelize.STRING,
  name: Sequelize.STRING
})

const TitleService = database.define('title_service', {
  titleId: Sequelize.STRING
})

TitleService.belongsTo(Service)

module.exports = {
  Service,
  TitleService,
  database
}
