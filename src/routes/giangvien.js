const Router = require('express-promise-router')
const router = new Router()
const pool = require('../model')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const md5 = require('md5')

router.use(bodyParser.urlencoded({ extended: false }))

module.exports = router

router.get('/', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id >= 1){
        (async() => {
            const client = await pool.connect()
            try {
                const doan = await client.query("SELECT * FROM giangvien as gv, doan as da, sinhvien as sv, trangthai as tt, loaidoan as lda WHERE da.ma_gv=gv.ma_gv AND da.ma_sv=sv.ma_sv AND da.ma_tt = tt.ma_tt AND da.ma_lda=lda.ma_lda AND da.ma_gv='"+req._passport.session.user.id+"'")
                const gv = await client.query("SELECT * FROM giangvien WHERE ma_gv='"+req._passport.session.user.id+"'")
                console.log({doan: doan.rows, usr: gv.rows[0]})
                res.render('./giangvien/homepages/giangvien',{doan: doan.rows, usr: gv.rows[0]})
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
})

router.get('/danhsach', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id == 0){
        (async() => {
            const client = await pool.connect()
            try {
                const result = await client.query('SELECT * FROM giangvien, khoavien WHERE giangvien.ma_kv = khoavien.ma_kv')
                res.render('./giangvien/danhsach',{giangvien: result.rows.reverse()})
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
})

router.get('/them', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id == 0){
        (async() => {
            const client = await pool.connect()
            try {
                const result = await client.query('SELECT * FROM khoavien')
                res.render('./giangvien/them',{khoavien: result.rows})
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
})

router.post('/them', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id == 0){
        const ten_gv = req.body.ten_gv
        const email = req.body.email
        const sdt = req.body.sdt
        const ma_kv = req.body.ma_kv
        const mat_khau = req.body.email;
        (async() => {
            const client = await pool.connect()
            try {
                await client.query("INSERT INTO giangvien (ten_gv,email,sdt,mat_khau,ma_kv) VALUES ('"+ten_gv +"','"+email+"','"+sdt+"','"+md5(email)+"','"+ma_kv+"' )");       
                req.flash("success", "Thêm giảng viên thành công")
                res.redirect("/giangvien/danhsach")
            } finally {
                client.release()
            }
        })(req,res).catch((e) => {
            console.log(e.stack)
            req.flash("error", "Thêm giảng viên thất bại / Lỗi: " + e.message)
            res.redirect("/giangvien/danhsach")
        })
    } else res.redirect('/dangnhap')
})

router.get('/xoa/:id', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id == 0){
        (async() => {
            const client = await pool.connect()
            try {
                const gv = await client.query('SELECT ten_gv FROM giangvien WHERE ma_gv='+req.params.id)
                ten_gv = gv.rows[0].ten_gv
                await client.query("DELETE FROM giangvien WHERE ma_gv="+req.params.id)       
                req.flash("success", "Xoá giảng viên "+ten_gv+" thành công")
                res.redirect("/giangvien/danhsach")
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Xóa giảng viên thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
})

router.get('/sua/:id', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id == 0){
        (async() => {
            const client = await pool.connect()
            try {
                const result1 = await client.query('SELECT * FROM khoavien')
                const result2 = await client.query('SELECT * FROM giangvien WHERE ma_gv=' + req.params.id)
                res.render('./giangvien/sua',{giangvien: result2.rows[0], khoavien: result1.rows})
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
})

router.post('/sua/:id', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id == 0){
        const ten_gv = req.body.ten_gv
        const email = req.body.email
        const sdt = req.body.sdt
        const ma_kv = req.body.ma_kv;
        (async() => {
            const client = await pool.connect()
            try {
                await client.query("UPDATE giangvien SET ten_gv='"+ten_gv +"', email='"+email+"', sdt='"+sdt+"', ma_kv='"+ma_kv+"' WHERE ma_gv ="+req.params.id);       
                req.flash("success", "Sửa thông tin giảng viên "+ten_gv+" thành công")
                res.redirect("/giangvien/danhsach");
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Sửa thông tin giảng viên thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
})

router.get('/doithongtin/:id', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id >= 1){
        (async() => {
            const client = await pool.connect()
            try {
                const result1 = await client.query('SELECT * FROM khoavien')
                const result2 = await client.query('SELECT * FROM giangvien WHERE ma_gv=' + req.params.id)
                res.render('./giangvien/homepages/doithongtin',{usr: result2.rows[0], khoavien: result1.rows})
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
})

router.post('/doithongtin/:id', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id >= 1){
        const ten_gv = req.body.ten_gv
        const email = req.body.email
        const sdt = req.body.sdt
        const ma_kv = req.body.ma_kv;
        (async() => {
            const client = await pool.connect()
            try {
                await client.query("UPDATE giangvien SET ten_gv='"+ten_gv +"', email='"+email+"', sdt='"+sdt+"', ma_kv='"+ma_kv+"' WHERE ma_gv ="+req.params.id);       
                req.flash("success", "Sửa thông tin giảng viên "+ten_gv+" thành công")
                res.redirect("/giangvien");
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Sửa thông tin giảng viên thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
})

