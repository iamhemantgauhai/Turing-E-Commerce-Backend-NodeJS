var knex = require('knex')({
    client: "mysql",
    connection: {
        host :process.env.db_host,
        user :process.env.db_user,
        password : process.env.db_pass,
        database : process.env.db_name
    }
})

module.exports=knex