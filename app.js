const express = require('express')
const session = require('express-session')
const Controller = require('./controllers/controller')
const app = express()
const port = process.env.PORT ||3000

app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static(__dirname));
app.use(session({
  secret: 'yang tau aja', //untuk mengamankan session kita (wajib ada)
  resave: false, //untuk  tidak menyimpan perubahan email / uname dri user 
  saveUninitialized: false, 
  cookie: { 
    secure: false,
    sameSite: true 
  }
}))
app.use("/register", require("./routes/register"))
app.use("/", require("./routes/index"))
app.use("/home", require("./routes/home"))


app.use("/login", require("./routes/login"))
app.use("/logout", require("./routes/logout"))
app.use("/register", require("./routes/register"))

app.get('/logout', Controller.logOut)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})