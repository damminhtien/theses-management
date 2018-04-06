const users = require('./users')
const khoavien = require('./khoavien')
const admin = require('./admin')
const trangthai = require('./trangthai')

module.exports = (app) => {
  app.use('/users', users)
  app.use('/khoavien', khoavien)
  app.use('/admin', admin)
  app.use('/trangthai', trangthai)
}
