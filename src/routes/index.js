const khoavien = require('./khoavien')
const admin = require('./admin')
const loaidoan = require('./loaidoan')
const trangthai = require('./trangthai')
const giangvien = require('./giangvien')
const manguoncuoi = require('./manguoncuoi')
const home = require('./home')
const sinhvien = require('./sinhvien')
//const lienhe = require('./lienhe')
const dangnhap = require('./dangnhap')
const dangxuat = require('./dangxuat')
const doan = require('./doan')

module.exports = (app) => {
  app.use('/khoavien', khoavien)
  app.use('/admin', admin)
  app.use('/loaidoan', loaidoan)
  app.use('/trangthai', trangthai)
  app.use('/giangvien', giangvien)
  app.use('/manguoncuoi', manguoncuoi)
  app.use('/', home)
  app.use('/sinhvien', sinhvien)
  app.use('/dangnhap', dangnhap)
  app.use('/dangxuat', dangxuat)
  app.use('/doan', doan)
  //app.use('/lienhe', lienhe)
}