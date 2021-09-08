const express = require('express');
const router = express.Router();
const knex = require('../database/turingdb');

router.get('/departments', (req, res) => {
    knex
    .select('*')
    .from('department')
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
})

router.get('/departments/:id', (req, res) => {
    knex
    .select('*')
    .from('department')
    .where('department_id', req.params.id)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        console.log(err);
    })
})

module.exports = router