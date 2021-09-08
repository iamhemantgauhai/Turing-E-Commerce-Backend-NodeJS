const express = require('express');
const router = express.Router();
const knex = require('../database/turingdb');

router.get('/shipping/regions', (req, res) => {
    knex
    .select('*')
    .from('shipping_region')
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log({err : err.message});
    })
});

router.get('/shipping/regions/:id', (req, res) => {
    knex
    .select('*')
    .from('shipping_region')
    .where('shipping_region_id', req.params.id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
});

module.exports = router