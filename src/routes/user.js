const Router = require('express');
const middelware = require('../middelware/middelware');

const router = Router();

router.get('/details',middelware.authentication,middelware.checkRoles(['user']),(req,res)=>{
    res.status(200).json({message:'user authenticated'});
})

module.exports = router;