const express = require('express');
const router = express.Router();
const knex = require('../database/turingdb');

router.get('/categories', (req, res) => {
    knex
    .select('*')
    .from('category')
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
})

router.get('/categories/:id', (req, res) => {
    knex
    .select('*')
    .from('category')
    .where('category_id', req.params.id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
})

router.get('/categories/inProduct/:product_id', (req, res) => {
    const product_id = req.params.product_id;
    knex
    .select('category.category_id', 'department_id', 'name')
    .from('category')   
    .join('product_category', function(){
        this.on('category.category_id', 'product_category.category_id')
    })
    .where('product_category.category_id', product_id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
})
  
router.get('/categories/inDepartment/:department_id', (req, res) => {
    knex
    .select('*')
    .from('category')  
    .where('department_id', req.params.department_id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log({err : err.message});
    })
})

module.exports = router