const express = require('express')
const path = require('path')
// const cookieParser = require('cookie-parser')
const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy;
const login = require('connect-ensure-login');
const users = require('./db/user');
const { Strategy } = require('passport-strategy');
const { log } = require('console');
const port = process.env.PORT || 3000
const student = require('./protected/students')

const app = express()

app.use('/static', express.static('public'))
app.set('view', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.urlencoded({extended: false}))
app.use(require('express-session')({
  secret:'ToDayIsFriday',
  resave: false,
  saveUninitialized: false
}))

passport.use(new Strategy(
  (username, password, cb) => {
    console.log(`In passport local strategy check user ${username}`);
    users.findByUsername(username, (err, user) => {
      if(err) {return cb(err)}
      if(!user) {return cb(null, false)}
      let isMatch = bcrypt.compareSync(password,user.password)
      if (!isMatch) {return cb(null, false)}
      if(isMatch) {return cb(null, user)}
    })
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  users.findById(id, (err, user) => {
    if(err) {return cb(err)}
    cb(null, user)
  })
})

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (res,req) => {
  res.render('index', {
    title: 'MTEC Student'
  })
})

app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}) ,(req, res) => {
  console.log(`We got a user input successfully`);
  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login Page'
  })
})

app.get('/logout', (req, res, cb) => {
  req.logout((err) => {
    if(err) {return cb(err)}
  })
  res.redirect('/')
})

app.get('/students?', login.ensureLoggedIn(), student)

app.listen(port, () => {
  console.log(`"${bcrypt.hashSync("password12345", 10)}"`);
  console.log(`listening on port ${port}`);
})