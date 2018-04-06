const users = require('./users')
const khoavien = require('./khoavien')
const admin = require('./admin')
const loaidoan = require('./loaidoan')
const trangthai = require('./trangthai')

module.exports = (app) => {
  app.use('/users', users)
  app.use('/khoavien', khoavien)
  app.use('/admin', admin)
  app.use('/loaidoan', loaidoan)
  app.use('/trangthai', trangthai)
}
