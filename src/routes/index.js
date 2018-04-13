const khoavien = require('./khoavien')
const admin = require('./admin')
const loaidoan = require('./loaidoan')
const trangthai = require('./trangthai')
const giangvien = require('./giangvien')
const sinhvien = require('./sinhvien')
const lienhe = require('./lienhe')

module.exports = (app) => {
  app.use('/khoavien', khoavien)
  app.use('/admin', admin)
  app.use('/loaidoan', loaidoan)
  app.use('/trangthai', trangthai)
  app.use('/giangvien', giangvien)
  app.use('/sinhvien', sinhvien)
  app.use('/lienhe', lienhe)
}