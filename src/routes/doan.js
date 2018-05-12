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

router.get('/', (req, res, next) => {
    (async() => {
        const client = await pool.connect()
        try {
            const doan = await client.query('SELECT * FROM doan, giangvien, sinhvien, loaidoan, trangthai, manguoncuoi WHERE (doan.ma_gv = giangvien.ma_gv) AND (doan.ma_sv = sinhvien.ma_sv) AND (doan.ma_lda = loaidoan.ma_lda) AND (doan.ma_tt = trangthai.ma_tt) AND trangthai.ma_tt = 1 AND manguoncuoi.ma_da = doan.ma_da AND manguoncuoi.che_do = 1')
            const doandiemcao = await client.query('SELECT * FROM doan, giangvien, sinhvien, loaidoan, trangthai, manguoncuoi WHERE (doan.ma_gv = giangvien.ma_gv) AND (doan.ma_sv = sinhvien.ma_sv) AND (doan.ma_lda = loaidoan.ma_lda) AND (doan.ma_tt = trangthai.ma_tt) AND trangthai.ma_tt = 1 AND manguoncuoi.ma_da = doan.ma_da AND manguoncuoi.che_do = 1 ORDER BY doan.diem DESC LIMIT 10')
            const doanmoinhat = await client.query('SELECT * FROM doan, giangvien, sinhvien, loaidoan, trangthai, manguoncuoi WHERE (doan.ma_gv = giangvien.ma_gv) AND (doan.ma_sv = sinhvien.ma_sv) AND (doan.ma_lda = loaidoan.ma_lda) AND (doan.ma_tt = trangthai.ma_tt) AND trangthai.ma_tt = 1 AND manguoncuoi.ma_da = doan.ma_da AND manguoncuoi.che_do = 1 ORDER BY doan.ma_da DESC LIMIT 10')
            const khoavien = await client.query('SELECT * FROM khoavien')
            res.render('./doan/homepages/index', { doan: doan.rows, doandiemcao: doandiemcao.rows, doanmoinhat: doanmoinhat.rows, khoavien: khoavien.rows, usr: req._passport.session })
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

router.get('/danhsach', (req, res, next) => {
    if (req.isAuthenticated() && req._passport.session.user.id == 0) {
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
    if (req.isAuthenticated() && req._passport.session.user.id == 0) {
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
    if (req.isAuthenticated() && req._passport.session.user.id == 0) {
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
    if (req.isAuthenticated() && req._passport.session.user.id == 0) {
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
    if (req.isAuthenticated() && req._passport.session.user.id == 0) {
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
    if (req.isAuthenticated() && req._passport.session.user.id == 0) {
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
router.get('/:id', (req, res, next) => {
    
    (async() => {
        const client = await pool.connect()
        try {
            const result1 = await client.query('SELECT * FROM khoavien')
            const result2 = await client.query('select * from doan, giangvien, sinhvien, trangthai, loaidoan, khoavien where doan.ma_da='+req.params.id+' and giangvien.ma_kv=khoavien.ma_kv and doan.ma_gv=giangvien.ma_gv and doan.ma_sv = sinhvien.ma_sv and doan.ma_tt= trangthai.ma_tt and doan.ma_lda=loaidoan.ma_lda')
            const result3 = await client.query('select * from manguoncuoi, doan where doan.ma_da='+req.params.id+' and doan.ma_da=manguoncuoi.ma_da')
            const result4 = await client.query('select * from baocaotuan, doan, trangthai where doan.ma_da='+req.params.id+' and baocaotuan.ma_tt=trangthai.ma_tt and baocaotuan.ma_da=doan.ma_da')
            res.render('./doan/chitiet',{usr: req._passport.session, khoavien: result1.rows, doan: result2.rows[0], manguoncuoi: result3.rows[0], baocaotuan: result4.rows})
        } finally {
            client.release()
        }
    })(req,res).catch((e) => {
        console.log(e.stack)
    })
})


// ajax
// lay do an theo khoa vien
// loaidoan = 0, lay tat ca cac loai do an
// khoavien = 0, lay tat ca khoa vien
// d = 0, lay tat ca ban ghi
router.get("/loaidoan=:lda/khoavien=:kv/from=:s/limit=:d", (req, res) => {
    const lda = req.params.lda,
        kv = req.params.kv,
        s = req.params.s,
        d = req.params.d;
    let query;
    if (lda == 0) {
        if (kv == 0)
            query = "SELECT * FROM doan, sinhvien, giangvien WHERE doan.ma_sv = sinhvien.ma_sv AND doan.ma_tt = 1 AND doan.ma_gv = giangvien.ma_gv"
        else
            query = "SELECT * FROM doan, sinhvien, giangvien WHERE doan.ma_sv = sinhvien.ma_sv AND doan.ma_tt = 1 AND doan.ma_gv = giangvien.ma_gv AND giangvien.ma_kv = '" + kv + "'"
    } else {
        if (kv == 0)
            query = "SELECT * FROM doan, sinhvien, giangvien WHERE doan.ma_sv = sinhvien.ma_sv AND doan.ma_tt = 1 AND doan.ma_gv = giangvien.ma_gv AND doan.ma_lda = " + lda
        else
            query = "SELECT * FROM doan, sinhvien, giangvien WHERE doan.ma_sv = sinhvien.ma_sv AND doan.ma_tt = 1 AND doan.ma_gv = giangvien.ma_gv AND doan.ma_lda = " + lda + " AND giangvien.ma_kv = '" + kv + "'"
    }
    if(d != 0){
        query += " OFFSET " + s + " LIMIT " + d
    }
    console.log(query);
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query(query, (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.json({ doan: result.rows.reverse(), usr: req._passport.session });
        })
    })
});