const Router = require('express-promise-router')
const router = new Router()
const pool = require('../model')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }))

module.exports = router

router.get('/danhsach', (req, res, next) => {
    (async() => {
        const client = await pool.connect()
        try {
            const result = await client.query('SELECT * FROM lienhe')
            res.render('./lienhe/danhsach',{lienhe: result.rows.reverse()})
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

router.get('/them', (req, res, next) => {
    (async() => {
        const client = await pool.connect()
        try {
            const result1 = await client.query('SELECT * FROM sinhvien')
            const result2 = await client.query('SELECT * FROM giangvien')
            res.render('./lienhe/them',{sinhvien: result1.rows}, {giangvien: result2.rows})
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

router.post('/them', (req, res, next) => {
    const ten_ = req.body.ten_kv;
    const dia_chi = req.body.dia_chi;
    console.log(req.body);
    (async() => {
        const client = await pool.connect()
        try {
            await client.query("INSERT INTO lienhe (ten_kv,dia_chi) VALUES ('"+ten_kv +"','"+dia_chi+"')");       
            req.flash("success", "Thêm viện thành công")
            res.redirect("/lienhe/danhsach");
        } finally {
            client.release()
        }
    })(req).catch((e,req) => {
        console.log(e.stack)
        req.flash("error", "Thêm viện thất bại / Lỗi: " + e.stack)
    })
});
