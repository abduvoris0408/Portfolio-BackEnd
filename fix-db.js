const { sequelize } = require('./models');

async function fixDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        console.log('Altering users table...');
        // Drop the default constraint if it exists (Sequelize sometimes adds one)
        try {
            await sequelize.query('ALTER TABLE "users" ALTER COLUMN "avatar" DROP DEFAULT;');
        } catch (e) {
            console.log('No default to drop or error dropping default', e.message);
        }

        // Cast column to JSONB
        await sequelize.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "avatar" TYPE jsonb 
      USING CASE 
        WHEN "avatar" IS NULL OR "avatar" = '' THEN null 
        ELSE json_build_object('url', "avatar", 'publicId', null) 
      END;
    `);

        console.log('Avatar column successfully altered to JSONB!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing database:', error);
        process.exit(1);
    }
}

fixDatabase();
