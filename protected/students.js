const express = require('express')
const router = express.Router()
const path = require('path')

// url -- localhost:3000/student/
router.get('/', (req, res) => {
  res.render('students' , {
    user: req.user,
    Student: req.user.username
  })
})

router.get('/registration', (res, req) => {
  let file = path.join(__dirname, 'data', 'myData.txt')
  console.log(file);
  res.sendFile(file)
})

module.exports = router