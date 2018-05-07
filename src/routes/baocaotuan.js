const Router = require('express-promise-router')
const router = new Router()
const pool = require('../model')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const fs = require('fs');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }))

module.exports = router

router.get('/danhsach', (req, res, next) => {
	if(req.isAuthenticated() && req._passport.session.user.id > 100000){
	    (async() => {
	        const client = await pool.connect()
	        try {
	            const result = await client.query('SELECT * FROM doan, baocaotuan, trangthai, sinhvien WHERE (baocaotuan.ma_da = doan.ma_da) AND (baocaotuan.ma_tt = trangthai.ma_tt) AND (baocaotuan.ma_sv = sinhvien.ma_sv)')
	            res.render('./baocaotuan/danhsach',{baocaotuan: result.rows})
	        } finally {
	            client.release()
	        }
	    })().catch(e => console.log(e.stack))
	} else res.redirect('/dangnhap')
});

router.get('/them', (req, res, next) => {
	if(req.isAuthenticated() && req._passport.session.user.id > 100000){
	    (async() => {
	        const client = await pool.connect()
	        try {
	            const sv = await client.query('SELECT ma_sv, ten_sv FROM sinhvien')
	            const tt = await client.query('SELECT * FROM trangthai')
	            const da = await client.query('SELECT ma_da FROM doan')
	            res.render('./baocaotuan/them',{sinhvien: sv.rows, trangthai: tt.rows, doan: da.rows})
	        } finally {
	            client.release()
	        }
	    })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
});

router.post('/them', (req, res, next) => {
	if(req.isAuthenticated() && req._passport.session.user.id > 100000){
	    const ma_da = req.body.ma_da
	    const ma_sv = req.body.ma_sv
	    const ma_tt = req.body.ma_tt
	    let file = req.files.tep
	    const thoi_gian_upload = req.body.thoi_gian_upload
	    const ghi_chu = req.body.ghi_chu
	    const diem = req.body.diem;
	    (async() => {
	        const client = await pool.connect()
	        try {
	        	if(file == undefined){
	        		await client.query("INSERT INTO baocaotuan (ma_da,ma_sv,ma_tt,thoi_gian_upload,ghi_chu,diem) VALUES ('"+ma_da+"','"+ma_sv+"','"+ma_tt+"','"+thoi_gian_upload+"','"+ghi_chu+"','"+diem+"')");
	        	}
	            if(file != undefined){
	            	let fileName = addFile(file)
					await client.query("INSERT INTO baocaotuan (ma_da,ma_sv,ma_tt,tep,thoi_gian_upload,ghi_chu,diem) VALUES ('"+ma_da+"','"+ma_sv+"','"+ma_tt+"','"+fileName+"','"+thoi_gian_upload+"','"+ghi_chu+"','"+diem+"')");
	        	}
	            req.flash("success", "Thêm báo cáo tuần thành công")
	            res.redirect("/baocaotuan/danhsach")
	        } finally {
	            client.release()
	        }
	    })(req,res).catch((e) => {
	        console.log(e.stack)
	        req.flash("error", "Thêm báo cáo tuần thất bại / Lỗi: " + e.message)
	        res.redirect("/baocaotuan/danhsach")
	    })
    } else res.redirect('/dangnhap')
});

router.get('/sua/:id', (req, res, next) => {
	if(req.isAuthenticated() && req._passport.session.user.id > 100000){
	    (async() => {
	        const client = await pool.connect()
	        try {
	            const sv = await client.query('SELECT ma_sv, ten_sv FROM sinhvien')
	            const tt = await client.query('SELECT * FROM trangthai')
	            const da = await client.query('SELECT ma_da FROM doan')
	            const bct = await client.query('SELECT * FROM baocaotuan WHERE ma_bct=' + req.params.id)
	            res.render('./baocaotuan/sua',{baocaotuan: bct.rows[0], sinhvien: sv.rows, trangthai: tt.rows, doan: da.rows})
	        } finally {
	            client.release()
	        }
	    })().catch(e => console.log(e.stack))
    } else res.redirect('/dangnhap')
});

router.post('/sua/:id', (req, res, next) => {
	if(req.isAuthenticated() && req._passport.session.user.id > 100000){
		const ma_da = req.body.ma_da
	    const ma_sv = req.body.ma_sv
	    const ma_tt = req.body.ma_tt
	    let file = req.files.tep
	    const thoi_gian_upload = req.body.thoi_gian_upload
	    const ghi_chu = req.body.ghi_chu
	    const diem = req.body.diem;
	  	(async() => {
	        const client = await pool.connect()
	        try {
	        	if(file == undefined){
	  				await client.query("UPDATE baocaotuan SET ma_da='"+ma_da+"',ma_sv='"+ma_sv+"',ma_tt='"+ma_tt+"',thoi_gian_upload='"+thoi_gian_upload+"',ghi_chu='"+ghi_chu+"', diem='"+diem+"' WHERE ma_bct ="+req.params.id)
	  			}
	  			if(file != undefined){
	          		const bct = await client.query('SELECT tep FROM baocaotuan WHERE ma_bct='+req.params.id)
		            tep = bct.rows[0].tep
		            if(tep != null){
		              fs.unlink('./public/upload/baocaotuan/' + tep, (err) => {
		              	if (err) throw err;
		                console.log('successfully deleted');
		              });
		            }
	          		let fileName = addFile(file)
	  				await client.query("UPDATE baocaotuan SET ma_da='"+ma_da+"',ma_sv='"+ma_sv+"',ma_tt='"+ma_tt+"',tep='"+fileName+"',thoi_gian_upload='"+thoi_gian_upload+"',ghi_chu='"+ghi_chu+"', diem='"+diem+"' WHERE ma_bct ="+req.params.id)
	  			}
	            req.flash("success", "Sửa thông tin báo cáo tuần thành công")
	            res.redirect("/baocaotuan/danhsach")
	        } finally {
	            client.release()
	            res.redirect("/baocaotuan/danhsach")
	        }
	    })(req).catch((e,req) => {
	        console.log(e.stack)
	        req.flash("error", "Sửa thông tin báo cáo tuần thất bại / Lỗi: " + e.stack)
	    })
    } else res.redirect('/dangnhap')
});

function addFile(file){
  let fileName = Date.now() + Math.floor((Math.random() * 100) + 1) + file.name
  if(fileName.length >= 255) fileName = fileName.slice(fileName.length-100, 100)
  file.mv('./public/upload/baocaotuan/'+fileName, function(err) {
    if (err) return res.status(500).send(err)
  })
  return fileName
}

router.get('/xoa/:id', (req, res, next) => {
	if(req.isAuthenticated() && req._passport.session.user.id > 100000){
	    (async() => {
	        const client = await pool.connect()
	        try {
	            const bct = await client.query('SELECT tep FROM baocaotuan WHERE ma_bct='+req.params.id)
	            tep = bct.rows[0].tep
	            if(tep != null){
	              fs.unlink('./public/upload/baocaotuan/' + tep, (err) => {
	              	if (err) throw err;
	                console.log('successfully deleted');
	              });
	            }
	            await client.query("DELETE FROM baocaotuan WHERE ma_bct="+req.params.id)   
	            req.flash("success", "Xoá báo cáo tuần thành công")
	            res.redirect("/baocaotuan/danhsach");
	        } finally {
	            client.release()
	        }
	    })(req).catch((e,req) => {
	        console.log(e.stack)
	        req.flash("error", "Xóa báo cáo tuần thất bại / Lỗi: " + e.stack)
	    })
    } else res.redirect('/dangnhap')
});