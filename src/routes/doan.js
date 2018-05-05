const Router = require('express-promise-router')
const router = new Router()
const pool = require('../model')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const fs = require('fs');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }))
const md5 = require('md5')

module.exports = router

router.get('/danhsach', (req, res, next) => {
    if (req.isAuthenticated() && req._passport.session.user.id > 100000) {
        (async() => {
            const client = await pool.connect()
            try {
                const result = await client.query('SELECT * FROM doan, giangvien, sinhvien, loaidoan, trangthai WHERE (doan.ma_gv = giangvien.ma_gv) AND (doan.ma_sv = sinhvien.ma_sv) AND (doan.ma_lda = loaidoan.ma_lda) AND (doan.ma_tt = trangthai.ma_tt)')
                console.log(result.rows)
                res.render('./doan/danhsach', { doan: result.rows })
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
                const gv = await client.query('SELECT ma_gv, ten_gv FROM giangvien')
                const sv = await client.query('SELECT ma_sv, ten_sv FROM sinhvien')
                const tt = await client.query('SELECT * FROM trangthai')
                const lda = await client.query('SELECT * FROM loaidoan')
                const mnc = await client.query('SELECT ma_mnc FROM manguoncuoi')
                res.render('./doan/them', { giangvien: gv.rows, sinhvien: sv.rows, trangthai: tt.rows, loaidoan: lda.rows, manguoncuoi: mnc.rows })
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
});

router.post('/them', (req, res, next) => {
    if (req.isAuthenticated() && req._passport.session.user.id > 100000) {
        const ma_gv = req.body.ma_gv
        const ma_sv = req.body.ma_sv
        const ma_tt = req.body.ma_tt
        const ten_de_tai = req.body.ten_de_tai
        const ki_hoc = req.body.ki_hoc
        let file = req.files.tep_bao_cao
        const ghi_chu_sv = req.body.ghi_chu_sv
        const ghi_chu_gv = req.body.ghi_chu_gv
        const ma_lda = req.body.ma_lda
        const diem = req.body.diem;
        (async() => {
            const client = await pool.connect()
            try {
                if (file == undefined) {
                    await client.query("INSERT INTO doan (ma_gv,ma_sv,ma_tt,ten_de_tai,ki_hoc,ghi_chu_sv,ghi_chu_gv,ma_lda,diem) VALUES ('" + ma_gv + "','" + ma_sv + "','" + ma_tt + "','" + ten_de_tai + "','" + ki_hoc + "','" + ghi_chu_sv + "','" + ghi_chu_gv + "','" + ma_lda + "','" + diem + "' )");
                }
                if (file != undefined) {
                    let fileName = addFile(file)
                    await client.query("INSERT INTO doan (ma_gv,ma_sv,ma_tt,ten_de_tai,ki_hoc,tep_bao_cao,ghi_chu_sv,ghi_chu_gv,ma_lda,diem) VALUES ('" + ma_gv + "','" + ma_sv + "','" + ma_tt + "','" + ten_de_tai + "','" + ki_hoc + "','" + fileName + "','" + ghi_chu_sv + "','" + ghi_chu_gv + "','" + ma_lda + "','" + diem + "' )");
                }
                req.flash("success", "Thêm đồ án thành công")
                res.redirect("/doan/danhsach")
            } finally {
                client.release()
            }
        })(req, res).catch((e) => {
            console.log(e.stack)
            req.flash("error", "Thêm đồ án thất bại / Lỗi: " + e.message)
            res.redirect("/doan/danhsach")
        })
    } else res.redirect('/dangnhap')
});

router.get('/sua/:id', (req, res, next) => {
    if (req.isAuthenticated() && req._passport.session.user.id > 100000) {
        (async() => {
            const client = await pool.connect()
            try {
                const gv = await client.query('SELECT ma_gv, ten_gv FROM giangvien')
                const sv = await client.query('SELECT ma_sv, ten_sv FROM sinhvien')
                const tt = await client.query('SELECT * FROM trangthai')
                const lda = await client.query('SELECT * FROM loaidoan')
                const mnc = await client.query('SELECT ma_mnc FROM manguoncuoi')
                const da = await client.query('SELECT * FROM doan WHERE ma_da=' + req.params.id)
                res.render('./doan/sua', { doan: da.rows[0], giangvien: gv.rows, sinhvien: sv.rows, trangthai: tt.rows, loaidoan: lda.rows, manguoncuoi: mnc.rows })
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
});

router.post('/sua/:id', (req, res, next) => {
    if (req.isAuthenticated() && req._passport.session.user.id > 100000) {
        const ma_gv = req.body.ma_gv
        const ma_sv = req.body.ma_sv
        const ma_tt = req.body.ma_tt
        const ma_mnc = req.body.ma_mnc
        const ten_de_tai = req.body.ten_de_tai
        const ki_hoc = req.body.ki_hoc
        let file = req.files.tep_bao_cao
        const ghi_chu_sv = req.body.ghi_chu_sv
        const ghi_chu_gv = req.body.ghi_chu_gv
        const ma_lda = req.body.ma_lda
        const diem = req.body.diem;
        (async() => {
            const client = await pool.connect()
            try {
                if (file == undefined) {
                    await client.query("UPDATE doan SET ma_gv='" + ma_gv + "',ma_sv='" + ma_sv + "',ma_tt='" + ma_tt + "',ma_mnc='" + ma_mnc + "',ten_de_tai='" + ten_de_tai + "',ki_hoc='" + ki_hoc + "',ghi_chu_sv='" + ghi_chu_sv + "', ghi_chu_gv='" + ghi_chu_gv + "',ma_lda='" + ma_lda + "', diem='" + diem + "' WHERE ma_da =" + req.params.id)
                }
                if (file != undefined) {
                    const da = await client.query('SELECT tep_bao_cao FROM doan WHERE ma_da=' + req.params.id)
                    tep_bao_cao = da.rows[0].tep_bao_cao
                    if (tep_bao_cao != null) {
                        fs.unlink('./public/upload/tep_bao_cao' + tep_bao_cao, (err) => {
                            if (err) throw err;
                            console.log('successfully deleted');
                        });
                    }
                    let fileName = addFile(file)
                    await client.query("UPDATE doan SET ma_gv='" + ma_gv + "',ma_sv='" + ma_sv + "',ma_tt='" + ma_tt + "',ma_mnc='" + ma_mnc + "',ten_de_tai='" + ten_de_tai + "',ki_hoc='" + ki_hoc + "',tep_bao_cao='" + fileName + "',ghi_chu_sv='" + ghi_chu_sv + "', ghi_chu_gv='" + ghi_chu_gv + "',ma_lda='" + ma_lda + "', diem='" + diem + "' WHERE ma_da =" + req.params.id)
                }
                req.flash("success", "Sửa thông tin đồ án thành công")
                res.redirect("/doan/danhsach")
            } finally {
                client.release()
                res.redirect("/doan/danhsach")
            }
        })(req).catch((e, req) => {
            console.log(e.stack)
            req.flash("error", "Sửa thông tin đồ án thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
});

function addFile(file) {
    let fileName = Date.now() + Math.floor((Math.random() * 100) + 1) + file.name
    if (fileName.length >= 255) fileName = fileName.slice(fileName.length - 100, 100)
    file.mv('./public/upload/tep_bao_cao/' + fileName, function(err) {
        if (err) return null;
    })
    return fileName
}

router.get('/xoa/:id', (req, res, next) => {
    if (req.isAuthenticated() && req._passport.session.user.id > 100000) {
        (async() => {
            const client = await pool.connect()
            try {
                const da = await client.query('SELECT tep_bao_cao FROM doan WHERE ma_da=' + req.params.id)
                tep_bao_cao = da.rows[0].tep_bao_cao
                if (tep_bao_cao != null) {
                    fs.unlink('./public/upload/tep_bao_cao' + tep_bao_cao, (err) => {
                        if (err) throw err;
                        console.log('successfully deleted');
                    });
                }
                await client.query("DELETE FROM doan WHERE ma_da=" + req.params.id)
                req.flash("success", "Xoá đồ án thành công")
                res.redirect("/doan/danhsach");
            } finally {
                client.release()
            }
        })(req).catch((e, req) => {
            console.log(e.stack)
            req.flash("error", "Xóa đồ án thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
});