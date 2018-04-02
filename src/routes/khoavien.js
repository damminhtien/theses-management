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
            const result = await client.query('SELECT * FROM khoavien')
            res.render('./khoavien/danhsach',{khoavien: result.rows.reverse()})
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

router.get('/them', (req, res, next) => {
    res.render("./khoavien/them")
});

router.post('/them', (req, res, next) => {
    const ten_kv = req.body.ten_kv;
    const dia_chi = req.body.dia_chi;
    console.log(req.body);
    (async() => {
        const client = await pool.connect()
        try {
            await client.query("INSERT INTO khoavien (ten_kv,dia_chi) VALUES ('"+ten_kv +"','"+dia_chi+"')");       
            req.flash("info", "Email queued");
            res.redirect("/khoavien/danhsach");
        } finally {
            client.release()
        }
    })(res).catch((e,res) => {
        console.log(e.stack)
    })
});