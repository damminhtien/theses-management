const express = require('express')
const router = express.Router()
const app = express()
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const pool = require('../model')

app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60 * 1000 * 60 },
    saveUninitialized: true,
    resave: true
}))

const cookieParser = require('cookie-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(cookieParser())
app.use(passport.session())

router.get('/', (req, res) => {
    req.logout()
    req.session.destroy()
    res.redirect('/')
})

module.exports = router