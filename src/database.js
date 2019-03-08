const Sequelize = require('sequelize')

const database = new Sequelize({
  database: 'movie_catalog',
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op
})

const Service = database.define('service', {
  userId: { type: Sequelize.STRING, unique: 'user-name', allowNull: false },
  name: { type: Sequelize.STRING, unique: 'user-name', allowNull: false }
})

const TitleService = database.define('title_service', {
  titleId: { type: Sequelize.STRING, unique: 'user-title' },
  location: Sequelize.STRING
})

TitleService.belongsTo(Service, {
  uniqueKey: 'user-title',
  foreignKey: { allowNull: false },
  onDelete: 'cascade'
})

module.exports = {
  Service,
  TitleService,
  database
}
