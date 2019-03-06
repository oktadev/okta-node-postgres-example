const Sequelize = require('sequelize')

const database = new Sequelize({
  database: 'movie_catalog',
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op
})

module.exports = {
  database
}
