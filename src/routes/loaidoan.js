const Router = require('express-promise-router')
const router = new Router()
const pool = require('../model')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }))

module.exports = router
router.get('/danhsach', (req, res, next) => {
    // if(req.isAuthenticated() && req._passport.session.user.id > 100000){
        (async() => {
            const client = await pool.connect()
            try {
                const result = await client.query('SELECT * FROM loaidoan')
                res.render('./loaidoan/danhsach',{loaidoan: result.rows.reverse()})
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    // } else res.redirect('/dangnhap')
})

router.post('/them', (req, res, next) => {
    // if(req.isAuthenticated() && req._passport.session.user.id > 100000){
        const ten_lda = req.body.ten_lda;
        (async() => {
            const client = await pool.connect()
            try {
                await client.query("INSERT INTO loaidoan (ten_lda) VALUES ('"+ten_lda+"')");       
                req.flash("success", "Thêm loại đồ án thành công")
                res.redirect("/loaidoan/danhsach");
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Thêm loại đồ án thất bại / Lỗi: " + e.stack)
        })
    // } else res.redirect('/dangnhap')
})

router.get('/xoa/:id', (req, res, next) => {
    // if(req.isAuthenticated() && req._passport.session.user.id > 100000){
        (async() => {
            const client = await pool.connect()
            try {
                const lda = await client.query('SELECT ten_lda FROM loaidoan WHERE ma_lda='+req.params.id)
                ten_lda = lda.rows[0].ten_lda
                await client.query("DELETE FROM loaidoan WHERE ma_lda="+req.params.id)       
                req.flash("success", "Xoá loại đồ án "+ten_lda+" thành công")
                res.redirect("/loaidoan/danhsach");
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Xóa loại đồ án thất bại / Lỗi: " + e.stack)
        })
    // } else res.redirect('/dangnhap')
})

router.post('/sua/:id', (req, res, next) => {
    // if(req.isAuthenticated() && req._passport.session.user.id > 100000){
        const ten_lda = req.body['ten_lda_sua_'+req.params.id];
        (async() => {
            const client = await pool.connect()
            try {
                await client.query("UPDATE loaidoan SET ten_lda='"+ten_lda +"' WHERE ma_lda = "+req.params.id);       
                req.flash("success", "Sửa loại đồ án "+ten_lda+" thành công")
                res.redirect("/loaidoan/danhsach");
            } finally {
                client.release()
            }
        })(req).catch((e,req) => {
            console.log(e.stack)
            req.flash("error", "Sửa loại đồ án "+ten_lda+" thất bại / Lỗi: " + e.stack)
        })
    // } else res.redirect('/dangnhap')
})