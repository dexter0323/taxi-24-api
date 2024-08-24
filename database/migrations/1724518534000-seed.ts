import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1724518524000 implements MigrationInterface {
  name = 'Seed1724518534000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "drivers" ("status", "latitude", "longitude") VALUES
            ('available', 18.4861, -69.9312),    -- Santo Domingo (Central Point)
            ('available', 18.4891, -69.9312),    -- Within 3 km
            ('available', 18.4901, -69.9312),    -- Within 3 km
            ('unavailable', 18.4911, -69.9312),  -- Within 3 km but unavailable
            ('available', 18.4961, -69.9312),    -- Outside 3 km
            ('available', 18.5001, -69.9312),    -- Outside 3 km
            ('available', 18.4871, -69.9322);    -- Within 3 km
    `);

    await queryRunner.query(`
        INSERT INTO "passengers" ("name", "email", "created_date", "updated_date") VALUES
            ('John Doe', 'john.doe@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Jane Smith', 'jane.smith@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Alice Johnson', 'alice.johnson@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Bob Brown', 'bob.brown@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Charlie Davis', 'charlie.davis@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Diana Evans', 'diana.evans@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Eve Adams', 'eve.adams@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `);

    await queryRunner.query(`
        INSERT INTO "trips" ("driverId", "passengerId", "start_latitude", "start_longitude", "end_latitude", "end_longitude", "start_time", "end_time") VALUES
            (1, 1, 18.4861, -69.9312, 18.4961, -69.9412, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (2, 2, 18.4891, -69.9312, 18.4991, -69.9412, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (3, 3, 18.4901, -69.9312, 18.5001, -69.9412, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (1, 4, 18.4861, -69.9312, 18.4961, -69.9412, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (2, 5, 18.4891, -69.9312, 18.4991, -69.9412, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (3, 6, 18.4901, -69.9312, 18.5001, -69.9412, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (7, 7, 18.4871, -69.9322, 18.4971, -69.9422, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        TRUNCATE TABLE "drivers" RESTART IDENTITY CASCADE;
        TRUNCATE TABLE "passengers" RESTART IDENTITY CASCADE;
        TRUNCATE TABLE "trips" RESTART IDENTITY CASCADE;
    `);
  }
}
