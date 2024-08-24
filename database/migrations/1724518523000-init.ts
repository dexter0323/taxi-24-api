import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1724518524000 implements MigrationInterface {
    name = 'Init1724518524000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" text NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "last_login" TIMESTAMP, "hach_refresh_token" character varying, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`CREATE TYPE "public"."drivers_status_enum" AS ENUM('available', 'unavailable', 'in_transit')`);
        await queryRunner.query(`CREATE TABLE "drivers" ("id" SERIAL NOT NULL, "status" "public"."drivers_status_enum" NOT NULL DEFAULT 'unavailable', "latitude" numeric(10,7) NOT NULL DEFAULT '0', "longitude" numeric(10,7) NOT NULL DEFAULT '0', "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trips" ("id" SERIAL NOT NULL, "start_latitude" numeric(10,7) NOT NULL, "start_longitude" numeric(10,7) NOT NULL, "end_latitude" numeric(10,7), "end_longitude" numeric(10,7), "start_time" TIMESTAMP, "end_time" TIMESTAMP, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "passengerId" integer NOT NULL, "driverId" integer NOT NULL, CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "passengers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9863c72acd866e4529f65c6c98c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_a4d572e126f5475433560c9a370" FOREIGN KEY ("passengerId") REFERENCES "passengers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_fc5a8911f85074a660a4304baa1" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_fc5a8911f85074a660a4304baa1"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_a4d572e126f5475433560c9a370"`);
        await queryRunner.query(`DROP TABLE "passengers"`);
        await queryRunner.query(`DROP TABLE "trips"`);
        await queryRunner.query(`DROP TABLE "drivers"`);
        await queryRunner.query(`DROP TYPE "public"."drivers_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
