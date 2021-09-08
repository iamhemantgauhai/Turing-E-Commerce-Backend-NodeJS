const express = require('express');
const router = express.Router();
const knex = require('../database/turingdb');

router.get('/tax', (req, res) => {
    knex
    .select('*')
    .from('tax')
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log({err : err.message});
    })
});

router.get('/tax/:id', (req, res) => {
    knex
    .select('*')
    .from('tax')
    .where('tax_id', req.params.id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
});

module.exports = router