const { sequelize, connectDB } = require('./config/db.config');

(async () => {
    try {
        await connectDB();

        // 1. users.avatar ni JSONB dan VARCHAR ga qaytarish (model STRING)
        console.log('1. users.avatar -> VARCHAR ga qaytarish...');
        try {
            await sequelize.query('ALTER TABLE "users" ALTER COLUMN "avatar" DROP DEFAULT');
            await sequelize.query(
                'ALTER TABLE "users" ALTER COLUMN "avatar" TYPE VARCHAR(500) USING ' +
                'CASE ' +
                'WHEN "avatar" IS NULL THEN \'\' ' +
                'WHEN "avatar"::text = \'null\' THEN \'\' ' +
                'ELSE COALESCE("avatar"->>\'url\', "avatar"::text, \'\') ' +
                'END'
            );
            await sequelize.query('ALTER TABLE "users" ALTER COLUMN "avatar" SET DEFAULT \'\'');
            console.log('   Done!');
        } catch (err) {
            console.error('   Error: ' + err.message);
        }

        // 2. experiences.location ni JSONB dan VARCHAR ga qaytarish (model STRING)
        console.log('2. experiences.location -> VARCHAR ga qaytarish...');
        try {
            await sequelize.query('ALTER TABLE "experiences" ALTER COLUMN "location" DROP DEFAULT');
            await sequelize.query(
                'ALTER TABLE "experiences" ALTER COLUMN "location" TYPE VARCHAR(200) USING ' +
                'CASE ' +
                'WHEN "location" IS NULL THEN \'\' ' +
                'WHEN "location"::text = \'null\' THEN \'\' ' +
                'ELSE COALESCE("location"->>\'url\', "location"::text, \'\') ' +
                'END'
            );
            await sequelize.query('ALTER TABLE "experiences" ALTER COLUMN "location" SET DEFAULT \'\'');
            console.log('   Done!');
        } catch (err) {
            console.error('   Error: ' + err.message);
        }

        // 3. Hamma JSONB ustunlardagi noto'g'ri qiymatlarni tozalash
        console.log('3. JSONB ustunlardagi noto\'g\'ri qiymatlarni tekshirish...');
        const tables = [
            { table: 'categories', cols: ['image'] },
            { table: 'projects', cols: ['image', 'gallery'] },
            { table: 'skills', cols: ['image'] },
            { table: 'services', cols: ['image'] },
            { table: 'blog_posts', cols: ['image'] },
            { table: 'news', cols: ['image'] },
            { table: 'education', cols: ['school_logo'] },
            { table: 'experiences', cols: ['company_logo', 'specializations'] },
            { table: 'about', cols: ['avatar', 'cover_image', 'resume', 'typing_texts', 'location', 'languages', 'social_links', 'stats', 'interests', 'what_i_do', 'seo'] },
        ];

        for (const { table, cols } of tables) {
            for (const col of cols) {
                try {
                    const [check] = await sequelize.query(
                        'SELECT column_name, data_type FROM information_schema.columns WHERE table_name=\'' + table + '\' AND column_name=\'' + col + '\''
                    );
                    if (check.length > 0) {
                        console.log('   ' + table + '.' + col + ' = ' + check[0].data_type);
                    }
                } catch (e) {
                    // skip
                }
            }
        }

        console.log('\nDone!');
        process.exit(0);
    } catch (err) {
        console.error('Error: ' + err.message);
        process.exit(1);
    }
})();
