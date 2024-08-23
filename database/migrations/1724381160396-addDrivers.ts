import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDrivers1724381160396 implements MigrationInterface {
    name = 'AddDrivers1724381160396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b67337b7f8aa8406e936c2ff75"`);
        await queryRunner.query(`CREATE TYPE "public"."drivers_status_enum" AS ENUM('available', 'unavailable', 'in_transit')`);
        await queryRunner.query(`CREATE TABLE "drivers" ("id" SERIAL NOT NULL, "status" "public"."drivers_status_enum" NOT NULL DEFAULT 'unavailable', "longitude" numeric(10,7) NOT NULL DEFAULT '0', "latitude" numeric(10,7) NOT NULL DEFAULT '0', "createdate" TIMESTAMP NOT NULL DEFAULT now(), "updateddate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP TABLE "drivers"`);
        await queryRunner.query(`DROP TYPE "public"."drivers_status_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b67337b7f8aa8406e936c2ff75" ON "user" ("username") `);
    }

}
