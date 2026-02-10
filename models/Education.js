const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.config')

const Education = sequelize.define('education', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    school: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: "O'quv muassasasi nomi kiritish majburiy" } },
    },
    degree: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: "Daraja kiritish majburiy" } },
    },
    fieldOfStudy: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        field: 'field_of_study',
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: '',
    },
    gpa: {
        type: DataTypes.FLOAT,
    },
    achievements: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    schoolUrl: {
        type: DataTypes.STRING(500),
        defaultValue: '',
        field: 'school_url',
    },
    schoolLogo: {
        type: DataTypes.JSONB,
        defaultValue: null,
        field: 'school_logo',
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
    tableName: 'education',
    indexes: [
        { fields: ['order'] },
        { fields: ['start_date'] },
    ],
    hooks: {
        beforeValidate: (edu) => {
            if (edu.current) edu.endDate = null
        },
    },
})

module.exports = Education
