const express=require('express')
const router=express.Router()
const knex=require('../database/turingdb')

router.get('/attributes',(req,res)=>{
    knex
    .select('*')
    .from('attribute')
    .then((data)=>{
        res.send(data)
    }).catch((err)=>{
        console.log(err);
    })
})

router.get('/attributes/:id',(req,res)=>{
    knex
    .select('*')
    .from('attribute')
    .where('attribute_id',req.params.id)
    .then((data)=>{
        res.send(data)
    }).catch((err)=>{
        console.log(err);
    })
})

router.get("/attribute/value/:id", (req, res) =>{
    let attribute_value_id = req.params.id;
    knex
    .select(
        'attribute_value_id',
        'value'
    )
    .from('attribute_value')
    .where('attribute_value_id', attribute_value_id)
    .then((data) =>{
        res.send(data);
    }).catch((err) =>{
        console.log(err);
    })
})

router.get("/attribute/inProduct/:product_id", (req, res) =>{
    let product_id = req.params.product_id;
    knex
    .select('*')
    .from('attribute')
    .join('attribute_value', function(){
        this.on('attribute.attribute_id','attribute_value.attribute_id')
    })
    .join('product_attribute', function(){
        this.on('attribute_value.attribute_value_id','product_attribute.attribute_value_id')
    })
    .where('product_attribute.product_id',product_id)
    .then((data) =>{    
        res.send(data);
    }).catch((err) =>{
        console.log(err);   
    })
})
module.exports=router