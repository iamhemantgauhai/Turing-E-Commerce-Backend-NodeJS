const { response } = require('express');
const express = require('express');
const router = express.Router();
const knex = require('../database/turingdb');
const jwt = require('jsonwebtoken');
const {verifyToken} = require('../auth/config');
// const passport = require('passport')
// const FacebookStrategy = require('passport-facebook').Strategy;
// const keys = require('./passport/keys')

router.post('/customers', (req, res) => {
    knex('customer')
    .insert({
    "name": req.body.name,
    "email": req.body.email,
    "password" : req.body.password,
    "address_1": req.body.address_1,
    "address_2": req.body.address_2,
    "city": req.body.city,
    "region": req.body.region,
    "postal_code": req.body.postal_code,
    "country" : req.body.country,
    "shipping_region_id": req.body.shipping_region_id,
    "credit_card": req.body.credit_card,
    "day_phone":  req.body.day_phone,
    "eve_phone":  req.body.eve_phone,  
    "mob_phone":  req.body.mob_phone
    })
    .then(() => {
        res.send({ message: 'Signup successfully' })
    }).catch((err) => {
        res.send({ err: err.message })
    })
})

router.get('/customer', (req, res) => {
    knex
    .select('*')
    .from('customer')
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
});

router.get('/customer/:id', (req, res) => {
    knex
    .select('*')
    .from('customer')
    .where('customer_id', req.params.id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
});

router.post('/customers/login', (req, res) => {
    knex
    .select('*').from('customer').where('email', req.body.email) 
    .then((data) => {
        if (data[0].password == req.body.password) {        
            var token = jwt.sign({...data}, 'anmol', {expiresIn: '24h'})
            res.cookie('token', token)
            res.send({message: 'login successfully'})   
        } else { 
            res.send({message: 'please check the passsword'})
        }
    })          
    .catch((err) => {
        res.send({err : err.message});
    })
})

// port.serializeUser((user, done) => {
//     done(null, user.id);
// });
// passport.deserializeUser((id, done) => {
//     User.findById(id).then((user) => {
//         done(null, user);
//     });
// });
// router.post('/customers/facebook', (req, res) => {
//     passport.use(new FacebookStrategy({
//     clientID: keys.facebook.clientID,
//     clientSecret: keys.facebook.clientSecret,
//     callbackURL: "/customers/facebook/"
//   },function(accessToken, refreshToken, profile, done) {
//     console.log(profile)
//      User.findOne({facebookId: profile.id}).then((currentUser) => {
//     if(currentUser){
//         // already have this user
//         console.log('user is: ', currentUser);
//         done(null, currentUser);
//     } else {
//         // if not, create user in our db
//         new User({
//             facebookId: profile.id,
//             username: profile.displayName,
//             // thumbnail: profile._json.image.url
//         }).save().then((newUser) => {
//             console.log('created new user: ', newUser);
//             done(null, newUser);
//         });
//     }});} )); })

// update the customer
router.put('/customer', (req, res) => {
    var token = req.headers.cookie
    var token = token.split('=')[1]
    var token_data = jwt.verify(token, "anmol");
    knex.select('*').from('customer').where('email', req.body.email)
    .then((data) => {
        knex('customer')
        .update({
            "address_1": req.body.address_1,
            "address_2": req.body.address_2,
            "city": req.body.city,
            "region": req.body.region,
            "postal_code": req.body.postal_code,
            "country" : req.body.country,
            "shipping_region_id": req.body.shipping_region_id,
            "credit_card": req.body.credit_card,
            "day_phone":  req.body.day_phone,
            "eve_phone":  req.body.eve_phone,  
            "mob_phone":  req.body.mob_phone
        }).where('customer_id', token_data[0].customer_id)
        .then(() => {
            res.send({message : "Successfully Updated" })
        })
        .catch((err) => {
            console.log({err : err.message});
        })
    })
    .catch((err) => {
        console.log({err : err.message});
    })
})

// update the address from customer
router.put("/customers/address",(req, res) =>{
    var token = req.headers.cookie
    token = token.split("=")[1];
    var token_data = jwt.verify(token, "anmol");
    knex.select('*').from('customer').where('email', req.body.email)
    .then(() => {
        knex('customer')
        .update({
            'address_1': req.body.address_1, 
            "address_2": req.body.address_2,
            "city": req.body.city,
            "region": req.body.region,
            "postal_code": req.body.postal_code,
            "country" : req.body.country,
            "shipping_region_id": req.body.shipping_region_id
        }).where('customer_id', token_data[0].customer_id)
        .then((data) =>{
            res.send({"Done": "data updated successfully!"});
        }).catch((err) =>{
            console.log(err);
            res.send({err: err.message})   
        })
    })
    .catch((err) =>{
        console.log(err);
        res.send({err : err.message})
    })
});

// update the customer creditcard
router.put("/customers/creditcard", verifyToken, (req, res) =>{
    var token = req.headers.cookie
    token = token.split("=")[1];
    var token_data = jwt.verify(token, "anmol");
    knex.select('*').from('customer').where('email', req.body.email)
    .then(() => {
        knex('customer')
        .update({
            "credit_card" : req.body.credit_card
        }).where('customer_id', token_data[0].customer_id)
        .then((data) =>{
            res.send({"Done": "Credit card updated successfully!"});
        }).catch((err) =>{
            console.log(err);
            res.send({err: err.message})
        })
    })
    .catch((err) =>{
        console.log(err);
        res.send({err : err.message})
    })
});
    
module.exports = router




