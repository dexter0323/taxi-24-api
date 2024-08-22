import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDriver1724289279070 implements MigrationInterface {
    name = 'AddDriver1724289279070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b67337b7f8aa8406e936c2ff75"`);
        await queryRunner.query(`CREATE TABLE "driver" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "location" character varying NOT NULL, "createdate" TIMESTAMP NOT NULL DEFAULT now(), "updateddate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP TABLE "driver"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b67337b7f8aa8406e936c2ff75" ON "user" ("username") `);
    }

}
