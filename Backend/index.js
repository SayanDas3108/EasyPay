const express = require('express')
var cors = require('cors')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json());

const MainRouter = require('./routes/index.js')



app.use("/api/v1" , MainRouter) // Telling app to route from "api/v1" using main router

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})