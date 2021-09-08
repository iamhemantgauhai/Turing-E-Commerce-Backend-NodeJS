const jwt = require('jsonwebtoken');
const knex = require('../database/turingdb');

function createtoken(req, res, next){
    try {
        var token = jwt.sign({...data}, 'anmol', {expiresIn: '24h'})
            res.cookie('token', token)
    }
    catch (err) {
        res.send({message : err.message})    
    }
}

function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.cookie
        const token = authHeader.split('=')[1]
        console.log(token);
        if (token == null) return res.sendStatus(401, "Token is not defined")
        jwt.verify(token, 'anmol', (err, user) => {
            if (err) return res.sendStatus(403, "Error in the generated token")
            res.user = user
            next()
        })
    } catch (err) {
        res.send({ message: 'unAuthorized' })
    }
}
 
module.exports = {verifyToken, createtoken}
