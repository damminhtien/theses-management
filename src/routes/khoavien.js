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
            res.render('./admin/layout/index')
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

router.get('/them', (req, res, next) => {
    res.render("./khoavien/them")
});

router.post('/them', (req, res, next) => {
    const tenkhoavien = req.body.tenkhoavien;
    console.log(req.body);
    (async() => {
        const client = await pool.connect()
        try {
            await client.query("INSERT INTO khoavien (ten_kv,dia_chi) VALUES ('" + tenkhoavien + "','b1')");
            res.redirect('../khoavien/danhsach');
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});