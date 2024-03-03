module.exports = {
  development: {
    client:'pg',
    connection :{
      host : '127.0.0.1',
      port : 5432,
      database : 'binar-app-db',
      user : 'alfikri',
      password : '6569227alfikri'
    },
    pool : {
      min : 2,
      max : 10
    },
    migration : {
      tableName : 'knex_migrations'
    }
  }
}
