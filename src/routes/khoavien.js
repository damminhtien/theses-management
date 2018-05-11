const Router = require('express-promise-router')
const router = new Router()
const pool = require('../model')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }))

module.exports = router

router.get('/danhsach', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id == 0){
        (async() => {
            const client = await pool.connect()
            try {
                const result = await client.query('SELECT * FROM khoavien')
                res.render('./khoavien/danhsach',{khoavien: result.rows.reverse()})
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
});

router.post('/them', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id == 0){
        const ten_kv = req.body.ten_kv;
        const dia_chi = req.body.dia_chi;
        (async() => {
            const client = await pool.connect()
            try {
                await client.query("INSERT INTO khoavien (ten_kv,dia_chi) VALUES ('"+ten_kv +"','"+dia_chi+"')");       
                req.flash("success", "Thêm viện thành công")
                res.redirect("/khoavien/danhsach");
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Thêm viện thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
});

router.get('/xoa/:id', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id == 0){
        (async() => {
            const client = await pool.connect()
            try {
                const kv = await client.query('SELECT ten_kv FROM khoavien WHERE ma_kv='+req.params.id)
                ten_kv = kv.rows[0].ten_kv
                await client.query("DELETE FROM khoavien WHERE ma_kv="+req.params.id)       
                req.flash("success", "Xoá viện "+ten_kv+" thành công")
                res.redirect("/khoavien/danhsach");
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Xóa viện thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
})

router.post('/sua/:id', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id == 0){
        const ten_kv = req.body['ten_kv_sua_'+req.params.id];
        const dia_chi = req.body['dia_chi_sua_'+req.params.id];
        (async() => {
            const client = await pool.connect()
            try {
                await client.query("UPDATE khoavien SET ten_kv='"+ten_kv +"',dia_chi='"+dia_chi+"' WHERE ma_kv = "+req.params.id);       
                req.flash("success", "Sửa viện "+ten_kv+" thành công")
                res.redirect("/khoavien/danhsach")
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Sửa viện "+ten_kv+" thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
})