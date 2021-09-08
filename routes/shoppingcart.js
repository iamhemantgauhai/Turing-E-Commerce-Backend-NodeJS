const express = require('express');
const router = express.Router();
const knex = require('../database/turingdb');

// getting shopping cart by unique ID
const random = require('randomstring');
router.get('/shoppingcart/generateUniqueId',async (req, res) => {
    const cart_id = random.generate(
        {
            charset : "alphanumeric"
        }
    )
    console.log(cart_id);
    res.send(`this is your cart_id : ${cart_id}`)
});

router.post('/shoppingcart/add', (req, res) => {
    knex('shopping_cart')
    .insert({
        "cart_id" : req.body.cart_id,
        "product_id" : req.body.product_id,
        "attributes" : req.body.attributes,
        "quantity" : req.body.quantity,
        "buy_now" :  req.body.buy_now,
        "added_on" : new Date
    })
    .then((data) =>{
        knex
        .select(
        'item_id', 
        'name', 
        'attributes', 
        'price', 
        'quantity', 
        'image', 
        'shoppig_cart.product_id', 
        "quantity")
        .from('shopping_cart')
        .join('product', function(){
            this.on('shopping_cart.product_id' , 'product.product_id')
        })
        res.send({message : "Successfully post!"})
    }).catch((err) =>{
        console.log(err);
        res.send({err: err.message})
    })
});

//getting shopping by cart_id
router.get('/shoppingcart/:cart_id', (req, res) => {
    knex
    .select(
        'item_id',
        'name',
        'attributes',
        'shopping_cart.product_id',
        'price',
        'quantity',
        'image'
    )
    .from('shopping_cart')
    .join('product', function(){
        this.on('shopping_cart.product_id', 'product.product_id')
    })
    .where('shopping_cart.cart_id', req.params.cart_id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })   
});


// update the cart by Item
router.put("/shoppingcart/update/:item_id", (req, res) =>{
        knex('shopping_cart')
        .update({
            "quantity" : req.body.quantity
        }).where('shopping_cart.item_id', req.params.item_id)
        .then((data) =>{
            knex.select('item_id',
            'product.name',
            'shopping_cart.attributes',
            'shopping_cart.product_id',
            'product.price',
            'shopping_cart.quantity',
            'product.image').from('shopping_cart')
            .where('shopping_cart.item_id', req.params.id)
            .join('product', function () {
                this.on('shopping_cart.product_id', 'product.product_id')

            }).then((data) => {
                res.send(data)
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({err: err.message})
            })
        }).catch((err) =>{
            console.log(err);
            res.send({err: err.message})
        })
});

router.delete('/shoppingcart/empty/:cart_id', (req, res) => {
    knex('shopping_cart')
    .where('shopping_cart.cart_id', req.params.cart_id)
    .del()
    .then(() => {
        res.send({message : "Successfully Deleted" })
    })
    .catch((err) => {
        console.log({err : err.message});
    })
})

router.get('/shoppingcart/totalAmount/:cart_id', (req, res) => {
    knex.select('price' , 'quantity').from('shopping_cart')
    .join('product', function(){
        this.on('shopping_cart.product_id', 'product.product_id')
    }).where('shopping_cart.cart_id', req.params.cart_id)
    .then((data) => {
        let dic = {}
        let a = data[0].price * data[0].quantity
        dic.totalAmount = a
        res.send(dic)
    }).catch((err) => {
        res.send({err : err.message})
    })
    
})

router.get('/shoppingcart/savedForLater/:item_id',(req, res) => {
    knex.schema.createTable('later', function(table){
        table.increments('item_id').primary();
        table.string('cart_id');
        table.integer('product_id');
        table.string('attributes');
        table.integer('quantity');
        table.integer('buy_now');
        table.datetime('added_on');
    }).then(() => {
        console.log("later table created successfully....")
    }).catch(() => {
        console.log("later table is already exists!");
    })
    knex.select("*").from('shopping_cart').where('item_id', req.params.item_id).then((data) => {
        knex('later').insert(data[0]).then((data2) => {
            knex.select("*").from('shopping_cart').where('item_id', req.params.item_id).del().then((data3) => {
                res.send({ message: 'Data successfully moved from shopping cart to save for later' })
            }).catch((err) => {
                res.send({ err: err.message })
            })
        }).catch((err) => {
            res.send({ err: err.message })
        })
    }).catch((err) => {
        res.send({ err: err.message })
    })
})

router.get('/shoppingcart/moveToCart/:item_id', (req, res) => {
    knex.schema.createTable('cart', function(table) {
        table.increments('item_id').primary();
        table.string('cart_id');
        table.integer('product_id');
        table.string('attributes');
        table.integer('quantity');
        table.integer('buy_now');
        table.datetime('added_on');
    }).then(() => {
        console.log('cart table created successfully');
    }).catch(() => {
        console.log('cart table already exists');
    })
    knex.select("*").from('later').where('item_id', req.params.item_id)
        .then((data) => {
            if (data.length > 0) {
                knex('cart').insert(data[0])
                    .then((data2) => {
                        knex.select('*').from('later').where('item_id', req.params.id).delete()
                            .then((data3) => {
                                res.send({ message: 'data move to shoppind cart to cart successfully' })
                            }).catch((err) => {
                                console.log('in first');
                                res.send({ err: err.message })
                            })
                    }).catch((err) => {
                        console.log('in second');
                        res.send({ err: err.message })
                    })
            } else {
                res.send({ message: 'this ID of item is not found' })
            }
        }).catch((err) => {
            res.send({ err: err.message })
        })
})

router.get('/shoppingcart/getSaved/:cart_id', (req, res) => {
    knex.select('item_id', 'product.name', 'shopping_cart.attributes', 'product.price')
    .from('shopping_cart').join('product', function () {
        this.on('shopping_cart.product_id', 'product.product_id')
    }).where('shopping_cart.cart_id', req.params.cart_id)
    .then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send({ err: err.message })
    })
})

router.delete('/shoppingcart/removedProduct/:item_id', (req, res) => {
    knex.select('*').from('shopping_cart').where('item_id', req.params.item_id).del().then((data) => {
        res.send({ message: 'product removed successfully from shopping cart' })
    }).catch((Err) => {
        res.send({ err: err.message })
    })
})

module.exports = router
