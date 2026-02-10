const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const ServiceDetail = sequelize.define('service_details', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    serviceId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'service_id',
        references: { model: 'services', key: 'id' },
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'Tafsilot nomi kiritish majburiy' } },
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: '',
    },
    icon: {
        type: DataTypes.STRING(100),
        defaultValue: '',
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'service_details',
    indexes: [
        { fields: ['service_id'] },
        { fields: ['order'] },
    ],
})

module.exports = ServiceDetail
