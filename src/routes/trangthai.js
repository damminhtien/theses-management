const Router = require('express-promise-router')
const router = new Router()
const pool = require('../model')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }))

module.exports = router

router.get('/danhsach', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id > 100000){
        (async() => {
            const client = await pool.connect()
            try {
                const result = await client.query('SELECT * FROM trangthai')
                res.render('./trangthai/danhsach',{trangthai: result.rows.reverse()})
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
})

router.post('/them', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id > 100000){
        const ten_tt = req.body.ten_tt;
        console.log(req.body);
        (async() => {
            const client = await pool.connect()
            try {
                await client.query("INSERT INTO trangthai (ten_tt) VALUES ('"+ten_tt+"')");       
                req.flash("success", "Thêm trạng thái thành công")
                res.redirect("/trangthai/danhsach");
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Thêm trạng thái thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
})

router.get('/xoa/:id', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id > 100000){
        (async() => {
            const client = await pool.connect()
            try {
                const tt = await client.query('SELECT ten_tt FROM trangthai WHERE ma_tt='+req.params.id);
                ten_tt = tt.rows[0].ten_tt
                await client.query("DELETE FROM trangthai WHERE ma_tt="+req.params.id)       
                req.flash("success", "Xoá trạng thái "+ten_tt+" thành công")
                res.redirect("/trangthai/danhsach");
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Xóa trạng thái thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
})

router.post('/sua/:id', (req, res, next) => {
    if(req.isAuthenticated() && req._passport.session.user.id > 100000){
        const ten_tt = req.body['ten_tt_sua_'+req.params.id];
        (async() => {
            const client = await pool.connect()
            try {
                await client.query("UPDATE trangthai SET ten_tt='"+ten_tt +"' WHERE ma_tt = "+req.params.id);       
                req.flash("success", "Sửa trạng thái "+ten_tt+" thành công")
                res.redirect("/trangthai/danhsach");
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Sửa trạng thái "+ten_tt+" thất bại / Lỗi: " + e.stack)
        })
    } else res.redirect('/dangnhap')
})