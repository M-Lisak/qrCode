const {Sequelize} = require('sequelize')

// localhost
// module.exports = new Sequelize(
//     'postgres',
//     'postgres',
//     'root',
//     {
//         host: 'localhost',
//         port: '5432',
//         dialect: 'postgres'
//     }
// )

const sequelize = new Sequelize(
    'qrCode',
    'mlisak',
    'root',
    {
        host: 'master.9e33305c-955a-4851-81f8-9901dc8a8475.c.dbaas.selcloud.ru',
        port: '5432',
        dialect: 'postgres'
    }
)

module.exports = sequelize
