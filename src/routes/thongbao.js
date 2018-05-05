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
    if (req.isAuthenticated() && req._passport.session.user.id > 100000) {
        (async() => {
            const client = await pool.connect()
            try {
                const result = await client.query('SELECT * FROM thongbao')
                res.render('./thongbao/danhsach', { thongbao: result.rows.reverse() })
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))

    } else res.redirect('/dangnhap')

});

router.get('/them', (req, res, next) => {
    if (req.isAuthenticated() && req._passport.session.user.id > 100000) {
        (async() => {
            const client = await pool.connect()
            try {
                res.render('./thongbao/them')
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
});

router.post('/them', (req, res, next) => {
    if (req.isAuthenticated() && req._passport.session.user.id > 100000) {
        const tieu_de = req.body.tieu_de
        const noi_dung = req.body.noi_dung
        let file = req.files.tep
        let img = req.files.img;

        (async() => {
            const client = await pool.connect()
            try {
                if (file == undefined && img == undefined) {
                    await client.query("INSERT INTO thongbao (tieu_de, noi_dung) VALUES ('" + tieu_de + "','" + noi_dung + "')")
                }

                if (file == undefined && img != undefined) {
                    let imgName = addImg(img);
                    await client.query("INSERT INTO thongbao (tieu_de, noi_dung, hinh_anh) VALUES ('" + tieu_de + "','" + noi_dung + "','" + imgName + "')")
                }
                if (file != undefined && img == undefined) {
                    let fileName = addFile(file);
                    await client.query("INSERT INTO thongbao (tieu_de, noi_dung, tep) VALUES ('" + tieu_de + "','" + noi_dung + "','" + fileName + "')")
                }
                if (file != undefined && img != undefined) {
                    let imgName = addImg(img);
                    let fileName = addFile(file);
                    await client.query("INSERT INTO thongbao (tieu_de, noi_dung, hinh_anh, tep) VALUES ('" + tieu_de + "','" + noi_dung + "','" + imgName + "','" + fileName + "')")
                }
                req.flash("success", "Thêm thông báo thành công")
                res.redirect("/thongbao/danhsach")
            } finally {
                client.release()
            }
        })(req, res).catch((e) => {
            console.log(e.stack)
            req.flash("error", "Thêm thông báo thất bại / Lỗi: " + e.message)
            res.redirect("/thongbao/danhsach")
        })

    } else res.redirect('/dangnhap')

});

router.get('/xoa/:id', (req, res, next) => {
    if (req.isAuthenticated() && req._passport.session.user.id > 100000) {
        (async() => {
            const client = await pool.connect()
            try {
                const tb = await client.query('SELECT hinh_anh, tep FROM thongbao WHERE ma_tb=' + req.params.id)

                tep = tb.rows[0].tep
                hinh_anh = tb.rows[0].hinh_anh
                if (hinh_anh != null) {
                    fs.unlink('./public/upload/thongbao/hinh_anh/' + hinh_anh, (err) => {
                        if (err) throw err;
                        console.log('successfully deleted');
                    });
                }
                if (tep != null) {
                    fs.unlink('./public/upload/thongbao/tep/' + tep, (err) => {
                        if (err) throw err;
                        console.log('successfully deleted');
                    });
                }
                await client.query("DELETE FROM thongbao WHERE ma_tb=" + req.params.id)
                req.flash("success", "Xoá thông báo thành công")
                res.redirect("/thongbao/danhsach");
            } finally {
                client.release()
            }
        })(req).catch((e, req) => {
            console.log(e.stack)
            req.flash("error", "Xóa thông báo thất bại / Lỗi: " + e.stack)
        })

    } else res.redirect('/dangnhap')
});

router.get('/sua/:id', (req, res, next) => {
    if (req.isAuthenticated() && req._passport.session.user.id > 100000) {
        (async() => {
            const client = await pool.connect()
            try {
                const result = await client.query('SELECT * FROM thongbao WHERE ma_tb=' + req.params.id)
                res.render('./thongbao/sua', { thongbao: result.rows[0] })
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
});

router.post('/sua/:id', (req, res, next) => {
    if (req.isAuthenticated() && req._passport.session.user.id > 100000) {
        const tieu_de = req.body.tieu_de
        const noi_dung = req.body.noi_dung
        let file = req.files.tep
        let img = req.files.img;
        console.log(req.body);
        (async() => {
            const client = await pool.connect()
            const tb = await client.query('SELECT hinh_anh, tep FROM thongbao WHERE ma_tb=' + req.params.id)
            tep = tb.rows[0].tep
            hinh_anh = tb.rows[0].hinh_anh
            try {
                if (file == undefined && img == undefined) {
                    await client.query("UPDATE thongbao SET tieu_de ='" + tieu_de + "',noi_dung = '" + noi_dung + "' WHERE ma_tb=" + req.params.id)
                }
                if (file == undefined && img != undefined) {
                    if (hinh_anh != null) {
                        fs.unlink('./public/upload/thongbao/hinh_anh/' + hinh_anh, (err) => {
                            if (err) throw err;
                            console.log('successfully deleted');
                        });
                    }
                    let imgName = addImg(img)
                    await client.query("UPDATE thongbao SET tieu_de = '" + tieu_de + "', noi_dung = '" + noi_dung + "', hinh_anh = '" + imgName + "' WHERE ma_tb=" + req.params.id)
                }
                if (file != undefined && img == undefined) {
                    if (tep != null) {
                        fs.unlink('./public/upload/thongbao/tep/' + tep, (err) => {
                            if (err) throw err;
                            console.log('successfully deleted');
                        });
                    }
                    let fileName = addFile(file)
                    await client.query("UPDATE thongbao SET tieu_de = '" + tieu_de + "', noi_dung = '" + noi_dung + "', tep = '" + fileName + "' WHERE ma_tb=" + req.params.id)
                }
                if (file != undefined && img != undefined) {
                    if (tep != null) {
                        fs.unlink('./public/upload/thongbao/tep/' + tep, (err) => {
                            if (err) throw err;
                            console.log('successfully deleted');
                        });
                    }
                    if (hinh_anh != null) {
                        fs.unlink('./public/upload/thongbao/hinh_anh/' + hinh_anh, (err) => {
                            if (err) throw err;
                            console.log('successfully deleted');
                        });
                    }
                    let imgName = addImg(img);
                    let fileName = addFile(file);
                    await client.query("UPDATE thongbao SET tieu_de = '" + tieu_de + "', noi_dung = '" + noi_dung + "', tep = '" + fileName + "', hinh_anh = '" + imgName + "' WHERE ma_tb=" + req.params.id);
                }
                req.flash("success", "Sửa thông tin thông báo " + tieu_de + " thành công")
                res.redirect("/thongbao/danhsach");
            } finally {
                client.release()
                res.redirect("/thongbao/danhsach");
            }
        })(req).catch((e, req) => {
            console.log(e.stack)
            req.flash("error", "Sửa thông tin thông báo thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
});

function addImg(img) {
    let imgName = Date.now() + Math.floor((Math.random() * 100) + 1) + img.name
    if (imgName.length >= 255) imgName = imgName.slice(imgName.length - 100, 100)
    img.mv('./public/upload/thongbao/hinh_anh/' + imgName, function(err) {
        if (err) return res.status(500).send(err)
    })
    return imgName
}

function addFile(file) {
    let fileName = Date.now() + Math.floor((Math.random() * 100) + 1) + file.name
    if (fileName.length >= 255) fileName = fileName.slice(fileName.length - 100, 100)
    file.mv('./public/upload/thongbao/tep/' + fileName, function(err) {
        if (err) return res.status(500).send(err)
    })
    return fileName
}