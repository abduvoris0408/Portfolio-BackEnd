const { sequelize, connectDB } = require('./config/db.config');

(async () => {
    try {
        await connectDB();

        console.log('🔄 achievements.type ni tuzatish...');

        // 1. Eski type ni o'chirish (agar bo'lsa)
        try {
            await sequelize.query('ALTER TABLE "achievements" ALTER COLUMN "type" DROP DEFAULT');
        } catch (e) { }

        // 2. ENUM type ni yaratish
        try {
            await sequelize.query(`
        DO $$ BEGIN 
          CREATE TYPE "public"."enum_achievements_type" AS ENUM('license', 'certificate', 'award', 'membership'); 
        EXCEPTION 
          WHEN duplicate_object THEN null; 
        END $$;
      `);
        } catch (e) {
            console.log('ENUM type already exists or error:', e.message);
        }

        // 3. Column type ni o'zgartirish (USING bilan)
        try {
            await sequelize.query(`
        ALTER TABLE "achievements" 
        ALTER COLUMN "type" TYPE "public"."enum_achievements_type" 
        USING CASE 
          WHEN "type"::text = 'license' THEN 'license'::"public"."enum_achievements_type"
          WHEN "type"::text = 'certificate' THEN 'certificate'::"public"."enum_achievements_type"
          WHEN "type"::text = 'award' THEN 'award'::"public"."enum_achievements_type"
          WHEN "type"::text = 'membership' THEN 'membership'::"public"."enum_achievements_type"
          ELSE 'certificate'::"public"."enum_achievements_type"
        END
      `);
            console.log('✅ Column type changed');
        } catch (e) {
            console.error('❌ Column type change error:', e.message);
        }

        // 4. Default qiymatni qaytarish
        await sequelize.query('ALTER TABLE "achievements" ALTER COLUMN "type" SET DEFAULT \'certificate\'::"public"."enum_achievements_type"');

        // 5. Comment qo'shish (alohida)
        await sequelize.query(`COMMENT ON COLUMN "achievements"."type" IS 'license=litsenziya, certificate=sertifikat, award=mukofot, membership=a''zolik'`);

        console.log('🎉 Fixed achievements.type!');
        process.exit(0);
    } catch (err) {
        console.error('Fatal Error:', err.message);
        process.exit(1);
    }
})();
