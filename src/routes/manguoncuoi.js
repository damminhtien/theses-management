const Router = require('express-promise-router')
const router = new Router()
const pool = require('../model')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const fs = require('fs');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }))

module.exports = router

router.get('/danhsach', (req, res, next) => {
  if(req.isAuthenticated() && req._passport.session.user.id == 0){
    (async() => {
        const client = await pool.connect()
        try {
            const result = await client.query('SELECT * FROM manguoncuoi')
            res.render('./manguoncuoi/danhsach',{manguoncuoi: result.rows.reverse()})
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
  } else res.redirect('/dangnhap')
})

router.get('/sua/:id', (req, res, next) => {
  if(req.isAuthenticated() && req._passport.session.user.id == 0){
    (async() => {
        const client = await pool.connect()
        try {
            const result = await client.query('SELECT * FROM manguoncuoi WHERE ma_mnc=' + req.params.id)
            res.render('./manguoncuoi/sua',{manguoncuoi: result.rows[0]})
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
  } else res.redirect('/dangnhap')
})

router.post('/sua/:id', (req, res, next) => {
  if(req.isAuthenticated() && req._passport.session.user.id == 0){
    const che_do = req.body.che_do
    let file = req.files.tep
    let img = req.files.img;  
    (async() => {
        const client = await pool.connect()
        const mnc = await client.query('SELECT hinh_anh, tep FROM manguoncuoi WHERE ma_mnc='+req.params.id)
        tep = mnc.rows[0].tep
        hinh_anh = mnc.rows[0].hinh_anh
        try {
          if(file == undefined && img == undefined){
          await client.query("UPDATE manguoncuoi SET che_do='"+che_do+"' WHERE ma_mnc ="+req.params.id)
        }
        if(file == undefined && img != undefined){
          if(hinh_anh != null){
            fs.unlink('./public/upload/manguoncuoi/hinh_anh/' + hinh_anh, (err) => {
              if (err) throw err;
              console.log('successfully deleted');
            });
          }
          let imgName = addImg(img)
          await client.query("UPDATE manguoncuoi SET che_do='"+che_do+"', hinh_anh='"+imgName+"' WHERE ma_mnc ="+req.params.id)
        }
        if(file != undefined && img == undefined){
          if(tep != null){
            fs.unlink('./public/upload/manguoncuoi/tep/' + tep, (err) => {
              if (err) throw err;
              console.log('successfully deleted');
            });
          }
          let fileName = addFile(file)
          await client.query("UPDATE manguoncuoi SET che_do='"+che_do+"', tep='"+fileName+"' WHERE ma_mnc ="+req.params.id)
        }
        if(file != undefined && img != undefined){
          if(tep != null){
            fs.unlink('./public/upload/manguoncuoi/tep/' + tep, (err) => {
              if (err) throw err;
              console.log('successfully deleted');
            });
          }
          if(hinh_anh != null){
            fs.unlink('./public/upload/manguoncuoi/hinh_anh/' + hinh_anh, (err) => {
              if (err) throw err;
              console.log('successfully deleted');
            });
          }
          let imgName = addImg(img)
          let fileName = addFile(file)
          await client.query("UPDATE manguoncuoi SET tep='"+fileName+"', che_do='"+che_do+"', hinh_anh='"+imgName+"' WHERE ma_mnc ="+req.params.id)
        }
            req.flash("success", "Sửa thông tin mã nguồn cuối thành công")
            res.redirect("/manguoncuoi/danhsach")
        } finally {
            client.release()
            res.redirect("/manguoncuoi/danhsach")
        }
    })(req).catch((e,req) => {
        console.log(e.stack)
        req.flash("error", "Sửa thông tin mã nguồn cuối thất bại / Lỗi: " + e.stack)
    })
  } else res.redirect('/dangnhap')
})

function addImg(img){
  let imgName = Date.now() + Math.floor((Math.random() * 100) + 1) + img.name
  if(imgName.length >= 255) imgName = imgName.slice(imgName.length-100, 100)
  img.mv('./public/upload/manguoncuoi/hinh_anh/'+imgName, function(err) {
    if (err) return res.status(500).send(err)
  })
  return imgName
}

function addFile(file){
  let fileName = Date.now() + Math.floor((Math.random() * 100) + 1) + file.name
  if(fileName.length >= 255) fileName = fileName.slice(fileName.length-100, 100)
  file.mv('./public/upload/manguoncuoi/tep/'+fileName, function(err) {
    if (err) return res.status(500).send(err)
  })
  return fileName
}

router.get('/xoa/:id', (req, res, next) => {
  if(req.isAuthenticated() && req._passport.session.user.id == 0){
    (async() => {
        const client = await pool.connect()
        try {
            const mnc = await client.query('SELECT hinh_anh, tep FROM manguoncuoi WHERE ma_mnc='+req.params.id)
            hinh_anh = mnc.rows[0].hinh_anh
            tep = mnc.rows[0].tep
            if(tep != null){
              fs.unlink('./public/upload/manguoncuoi/tep/' + tep, (err) => {
              if (err) throw err;
                console.log('successfully deleted');
              });
            }
            if(hinh_anh != null){
              fs.unlink('./public/upload/manguoncuoi/hinh_anh/' + hinh_anh, (err) => {
              if (err) throw err;
                console.log('successfully deleted');
              });
            }
            await client.query("DELETE FROM manguoncuoi WHERE ma_mnc="+req.params.id)   
            req.flash("success", "Xoá mã nguồn cuối thành công")
            res.redirect("/manguoncuoi/danhsach");
        } finally {
            client.release()
        }
    })(req).catch((e,req) => {
        console.log(e.stack)
        req.flash("error", "Xóa mã nguồn cuối thất bại / Lỗi: " + e.stack)
    })
  } else res.redirect('/dangnhap')
})