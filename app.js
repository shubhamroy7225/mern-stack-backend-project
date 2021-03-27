const express = require('express')
const bodyParser = require('body-parser')
const placesRouter = require('./routes/places.route')
const usersRouter = require('./routes/users.routes')
const HttpError = require('./models/http-error')
const router = require('./routes/users.routes')
const app = express()
app.use(bodyParser.json())
app.use('/api/places',placesRouter)
app.use('/api/users',usersRouter)
app.use((req,res,next)=>{
  const error = new HttpError("could not find the this routes",404)
  throw error

})
app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message:error.message || 'An unknown error occurred'})

})
app.listen(5000)