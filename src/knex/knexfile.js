module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'contraseña',
            database: 'basededatos'
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './migrations'
        },
        useNullAsDefault: true
    }
};