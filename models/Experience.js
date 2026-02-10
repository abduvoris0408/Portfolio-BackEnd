const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const Experience = sequelize.define('experiences', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    company: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'Tashkilot nomi kiritish majburiy' } },
    },
    position: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'Lavozim kiritish majburiy' } },
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: '',
    },
    specializations: {
        type: DataTypes.JSONB,
        defaultValue: [],
        comment: 'Huquq sohalari: ["Fuqarolik huquqi", "Jinoyat huquqi"]',
    },
    location: {
        type: DataTypes.STRING(200),
        defaultValue: '',
    },
    companyUrl: {
        type: DataTypes.STRING(500),
        defaultValue: '',
        field: 'company_url',
    },
    companyLogo: {
        type: DataTypes.JSONB,
        defaultValue: null,
        field: 'company_logo',
        comment: '{ url, publicId }',
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'start_date',
    },
    endDate: {
        type: DataTypes.DATEONLY,
        field: 'end_date',
    },
    current: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'experiences',
    indexes: [
        { fields: ['order'] },
        { fields: ['start_date'] },
    ],
    hooks: {
        beforeValidate: (exp) => {
            if (exp.current) exp.endDate = null
        },
    },
})

module.exports = Experience
