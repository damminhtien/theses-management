const Router = require('express-promise-router')
const router = new Router()
const pool = require('../model')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }))

module.exports = router

router.get('/', (req, res, next) => {
	res.render('./homepage/index', {usr: req._passport.session})
});

router.post('/search', (req, res, next) => {
	const searchterm = req.body.searchterm;
    (async() => {
        const client = await pool.connect()
        try {
            const result = await client.query("SELECT ts_headline(doan.ten_de_tai, plainto_tsquery('"+searchterm+"'), 'maxwords=1023, minwords=50') as ten_de_tai, ten_sv, ten_gv FROM doan, sinhvien, giangvien, plainto_tsquery('"+searchterm+"') query WHERE doan.ma_sv=sinhvien.ma_sv and doan.ma_gv=giangvien.ma_gv and query @@ to_tsvector(doan.ten_de_tai) ORDER BY ts_rank_cd(to_tsvector(ten_de_tai), query) DESC");  
            res.render('./search/searchresult',{doan: result.rows, searchterm: searchterm})     
        } finally {
            client.release()
            console.log("Tìm kiếm thành công")
        }
    })(req,res).catch((e) => {
        console.log(e.stack)
        // req.flash("error", "Tìm kiếm thất bại / Lỗi: " + e.message)
    })
})