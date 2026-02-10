const { Op } = require('sequelize')

/**
 * Universal API Features – Sequelize uchun
 * Filter, Search, Sort, Select, Populate (include), Pagination
 */
class ApiFeatures {
    constructor(model, queryString) {
        this.model = model
        this.queryString = queryString
        this.queryOptions = {
            where: {},
            order: [['created_at', 'DESC']],
            attributes: undefined,
            include: [],
        }
    }

    // Filtrlash: ?status=published&isActive=true
    filter() {
        const queryObj = { ...this.queryString }
        const excludeFields = ['search', 'sort', 'fields', 'page', 'limit', 'populate']
        excludeFields.forEach(el => delete queryObj[el])

        const where = {}

        for (const [key, value] of Object.entries(queryObj)) {
            // Operatorli filterlar: price[gte]=100
            if (typeof value === 'object') {
                const opMap = { gte: Op.gte, gt: Op.gt, lte: Op.lte, lt: Op.lt, ne: Op.ne }
                const conditions = {}
                for (const [op, val] of Object.entries(value)) {
                    if (opMap[op]) conditions[opMap[op]] = isNaN(val) ? val : Number(val)
                }
                where[key] = conditions
            } else {
                // Boolean conversion
                if (value === 'true') where[key] = true
                else if (value === 'false') where[key] = false
                else where[key] = isNaN(value) ? value : Number(value)
            }
        }

        this.queryOptions.where = { ...this.queryOptions.where, ...where }
        return this
    }

    // Qidirish: ?search=javascript
    search(fields = []) {
        if (this.queryString.search && fields.length > 0) {
            const searchTerm = this.queryString.search
            this.queryOptions.where[Op.or] = fields.map(field => ({
                [field]: { [Op.iLike]: `%${searchTerm}%` },
            }))
        }
        return this
    }

    // Saralash: ?sort=-createdAt,title yoki ?sort=order
    sort() {
        if (this.queryString.sort) {
            const sortFields = this.queryString.sort.split(',').map(field => {
                if (field.startsWith('-')) {
                    return [field.substring(1), 'DESC']
                }
                return [field, 'ASC']
            })
            this.queryOptions.order = sortFields
        }
        return this
    }

    // Maydon tanlash: ?fields=title,slug,status
    select(excludeFields = []) {
        if (this.queryString.fields) {
            this.queryOptions.attributes = this.queryString.fields.split(',')
        } else if (excludeFields.length > 0) {
            this.queryOptions.attributes = { exclude: excludeFields }
        }
        return this
    }

    // Includes (populate): Sequelize include massivi
    include(includes = []) {
        this.queryOptions.include = includes
        return this
    }

    // Sahifalash
    async paginate() {
        const page = parseInt(this.queryString.page) || 1
        const limit = parseInt(this.queryString.limit) || 10
        const offset = (page - 1) * limit

        const { count, rows: data } = await this.model.findAndCountAll({
            ...this.queryOptions,
            limit,
            offset,
            distinct: true, // Include bilan to'g'ri count
        })

        const totalPages = Math.ceil(count / limit)

        const pagination = {
            total: count,
            page,
            limit,
            totalPages,
        }

        if (page < totalPages) pagination.next = page + 1
        if (page > 1) pagination.prev = page - 1

        return { data, pagination }
    }

    // Build options (pagination'siz ishlatish uchun)
    build() {
        return this.queryOptions
    }
}

module.exports = ApiFeatures
