const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const lessMiddleware = require('less-middleware')
const session = require('express-session')
const fileUpload = require('express-fileupload');
const app = express()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const pool = require(__dirname + '/model/index')
const md5 = require('md5')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('connect-flash')())
app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60 * 1000 * 60 },
    saveUninitialized: true,
    resave: true
}))
app.use(function(req, res, next) {
    var flash = req.flash()
    res.locals.messages = Object.keys(flash).reduce(function(messages, type) {
        flash[type].forEach(function(message) {
            messages.push({ type: type, message: message })
        })
        return messages
    }, [])
    next()
})
app.use(fileUpload())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(cookieParser())
app.use(passport.session())
const mountRoutes = require('./routes')
mountRoutes(app)

passport.use(new LocalStrategy(
    (username, password, done) => {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            client.query("SELECT CAST(ma_sv AS BIGINT) as id, email, mat_khau, ten_sv as ten FROM sinhvien UNION SELECT ma_gv, email, mat_khau, ten_gv FROM giangvien UNION SELECT ma_qtv, email, mat_khau, ten_qtv FROM quantrivien", (err, result) => {
                release();
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
                var key = true;
                result.rows.forEach((usr) => {
                    console.log(username + md5(password))
                    console.log(usr)
                    if (usr.email == username) {
                        if (usr.mat_khau == md5(password)) {
                            key = false
                            return done(null, usr, { usr: usr })
                        } else {
                            key = false
                            return done(null, false, { message: 'Invalid password.' })
                        }
                    }
                })
                if (key == true) return done(null, false, { message: 'Invalid username.' })
            })
        })
    }
))

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(function(user, done) {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("SELECT CAST(ma_sv AS BIGINT) as id, email, mat_khau, ten_sv as ten FROM sinhvien UNION SELECT ma_gv, email, mat_khau, ten_gv FROM giangvien UNION SELECT ma_qtv, email, mat_khau, ten_qtv FROM quantrivien", (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            result.rows.forEach(function(usr) {
                if (usr.id == user.id) {
                    return done(null, user);
                }    
            });
        })
    })
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;