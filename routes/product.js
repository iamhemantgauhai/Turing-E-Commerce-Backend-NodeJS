const express = require('express');
const router = express.Router();
const knex = require('../database/turingdb')
const jwt = require('jsonwebtoken');
const {verifyToken} = require('../auth/config');

router.get('/products', (req, res) => {
    knex
    .select('*')
    .from('product')
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
});

router.get('/products/search', (req, res) => {
    const search = req.query.search
    // console.log(search);
    knex
    .select('product_id', 'name', "description", 'price', "discounted_price", "thumbnail")
    .from('product')
    .where('name', 'like', `%${search}%`)
    .orWhere('description', 'like', `%${search}%`)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
});

router.get('/products/:id', (req, res) => {
    knex
    .select('*')
    .from('product')
    .where('product_id', req.params.id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);   
    })
});

router.get('/products/inCategory/:category_id', (req, res) => {
    const category_id = req.params.category_id;
    knex
    .select('*')
    .from('product')   
    .join('product_category', function(){
        this.on('product.product_id', 'product_category.product_id')
    })
    .where('product_category.category_id', category_id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
});

router.get('/products/inDepartment/:department_id', (req, res) => {
    knex
    .select('product.product_id', 'product.name', 'product.description', 'product.price', 'product.discounted_price', 'product.thumbnail')
    .from('product')
    .join('product_category', function(){
        this.on('product.product_id', 'product_category.product_id')
    })
    .join('category', function(){
        this.on('product_category.category_id', 'category.category_id')
    })
    .join('department', function(){
        this.on('category.department_id', 'department.department_id')
    })
    .where('department.department_id', req.params.department_id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log({err : err.message});
    })
});

router.get('/products/:id/details', (req, res) => {
    knex
    .select('product.product_id', 'product.name', 'product.description', 'product.price', 'product.discounted_price', 'product.image', 'product.image_2')
    .from('product')
    .where('product_id', req.params.id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
});

router.get('/products/:id/locations', (req, res) => {
    knex
    .select('category.category_id', 'category.name as category_name', 'category.department_id', 'department.name as department_name' )
    .from('product')
    .join('product_category', function() {
        this.on('product.product_id', 'product_category.product_id')
    })
    .join('category', function() {
        this.on('product_category.category_id', 'category.category_id')
    })
    .join('department', function(){
        this.on('category.department_id', 'department.department_id')
    })
    .where('product.product_id', req.params.id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log({err : err.message});
    })
});   

router.get('/products/:product_id/reviews', (req, res) => {
    knex
    .select('customer.name as customer_name', 'review.review', 'review.rating', 'review.created_on')
    .from('review')
    .join('customer', function(){
        this.on('review.customer_id', 'customer.customer_id')
    })
    .where('product_id', req.params.product_id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log({err : err.message});
    })
})

router.post('/products/:product_id/reviews',(req, res) => {
    var token = req.headers.cookie
    var token = token.split("=")[1];
    var token_data = jwt.verify(token, "anmol")
    knex
    .select('*').from('customer').where('email', token_data[0].email)
    .then((data) => {
        knex('review')
        .insert({ 
            'customer_id' : token_data[0].customer_id,
            'product_id' : req.params.product_id,
            'review': req.body.review,
            'rating' : req.body.rating, 
            'created_on' : new Date
            })
            .then((data) => {
                res.send({"insert" : "Data inserted successfully!"})
            })
            .catch((err) => {
                console.log({err : err.message});
        })
    })
})


module.exports = router