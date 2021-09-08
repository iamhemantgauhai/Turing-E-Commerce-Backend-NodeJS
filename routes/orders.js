const express = require('express');
const router = express.Router();
const knex = require('../database/turingdb');
const jwt = require('jsonwebtoken');
const {verifyToken} = require('../auth/config');

//creating an order
router.post('/orders', verifyToken, (req, res) => {
    knex.select('*').from('shopping_cart').where('cart_id', req.body.cart_id).join('product', function () {
        this.on('shopping_cart.product_id', 'product.product_id')
    }).then((data) => {
        var token = req.headers.cookie
        token = token.split("=")[1];
        var token_data = jwt.verify(token, "anmol");
        knex('orders').insert({
            'total_amount': data[0].quantity * data[0].price,
            'created_on': new Date(),
            "customer_id": token_data[0].customer_id,
            "shipping_id": req.body.shipping_id,
            "tax_id": req.body.tax_id
        }).then((data2) => {
            console.log(data, '2')
            knex("order_detail").insert({
                "unit_cost": data[0].price,
                "quantity": data[0].quantity,
                "product_name": data[0].name,
                "attributes": data[0].attributes,
                "product_id": data[0].product_id,
                "order_id": data2[0]
            }).then((data3) => {
                console.log(data3, '3')
                knex.select('*').from('shopping_cart').where('cart_id', req.body.cart_id).del()
                    .then((data4) => {
                        res.send({
                            order_status: 'ordered successfully',
                            order_id: data2[0]
                        })
                    }).catch((err) => {
                        console.log('1');
                        res.send({ err: err.message })
                    })
            }).catch((err) => {
                console.log('2');
                res.send({ err: err.message })
            })
        }).catch((err) => {
            console.log('3');
            res.send({ err: err.message })
        })
    }).catch((err) => {
        console.log('4');
        res.send({ err: err.message })
    })
})

router.get('/orders/:order_id', (req, res) => {
    knex.select('orders.order_id',
        'product.product_id',
        'order_detail.attributes',
        'product.name as product_name',
        'order_detail.quantity',
        'product.price',
        'order_detail.unit_cost').from('orders')
        .join('order_detail', function () {
            this.on('orders.order_id', 'order_detail.order_id')
        }).join('product', function () {
            this.on('order_detail.product_id', 'product.product_id')
        }).where('orders.order_id', req.params.order_id)
        .then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send({ err: err.message })
        })
});

router.get('/orders/inCustomer/data', verifyToken, (req, res) => {
    var token = req.headers.cookie
        token = token.split("=")[1];
        var token_data = jwt.verify(token, "anmol");
    knex.select('*')
    .from('customer')
    .where('customer_id', token_data[0].customer_id)
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.send({ err: err.message })
        })
});

router.get('/orders/shortdetail/:order_id', verifyToken, (req, res) => {
    const order_id = req.params.order_id;
    knex.select('order_id', 'total_amount', "created_on", "shipped_on", "status", 'product.name').from('orders').join('product', function () {
        this.on('orders.order_id', 'product.product_id')
    }).where('orders.order_id', order_id).then((data) => {
        res.send(data)
    })
});

module.exports = router