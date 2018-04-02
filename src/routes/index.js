const users = require('./users')
const khoavien = require('./khoavien')

module.exports = (app) => {
  app.use('/users', users)
  app.use('/khoavien', khoavien)
}