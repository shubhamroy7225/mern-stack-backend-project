const express = require('express')
const router = express.Router()
const Dummy_data=[{
    id:'u1',
    name:'shubham',
    address:'20 w 34th st,New York, NY 1001',  
}]
router.get('/:uid',(req,res)=>{
    const userId = req.params.uid
    const user = Dummy_data.find(user=>user.id === userId)
    res.json(user)
})
module.exports=router