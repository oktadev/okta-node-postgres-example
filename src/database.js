const Sequelize = require('sequelize')

const database = new Sequelize({
  database: 'movie_catalog',
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op
})

const Title = database.define('title', {
  id: { type: Sequelize.STRING, primaryKey: true },
  title: { type: Sequelize.JSONB, allowNull: false }
})

const Service = database.define('service', {
  userId: { type: Sequelize.STRING, unique: 'user-name', allowNull: false },
  name: { type: Sequelize.STRING, unique: 'user-name', allowNull: false }
})

const TitleService = database.define('title_service', {
  location: Sequelize.STRING
})

TitleService.belongsTo(Title, {
  foreignKey: { allowNull: false, unique: 'title-service' },
  onDelete: 'cascade'
})

TitleService.belongsTo(Service, {
  foreignKey: { allowNull: false, unique: 'title-service' },
  onDelete: 'cascade'
})

module.exports = {
  Title,
  Service,
  TitleService,
  database
}
