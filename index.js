const express = require("express");
const mysql = require("mysql");
const app = express();
require('dotenv').config()
const jwt = require("jsonwebtoken")

app.use(express.json())

const department = require('./routes/departments')
app.use('/', department);

const categories = require('./routes/categories')
app.use('/', categories);

const attribute = require('./routes/attribute')
app.use('/', attribute)

const product = require('./routes/product');
app.use('/', product)

const customer = require('./routes/customer')
app.use('/', customer);

const shoppingcart = require('./routes/shoppingcart')
app.use('/', shoppingcart);

const orders = require('./routes/orders')
app.use('/', orders)

const shipping = require('./routes/shipping');
app.use('/', shipping) 

const tax = require('./routes/tax');
app.use('/', tax)

const port = process.env.db_port
app.listen(port,() => {
    console.log(`connected ${port}`);
})
  