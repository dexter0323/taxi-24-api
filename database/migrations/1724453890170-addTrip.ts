import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrip1724453890170 implements MigrationInterface {
    name = 'AddTrip1724453890170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trips" ("id" SERIAL NOT NULL, "start_latitude" numeric(10,7) NOT NULL, "start_longitude" numeric(10,7) NOT NULL, "end_latitude" numeric(10,7) NOT NULL, "end_longitude" numeric(10,7) NOT NULL, "start_time" TIMESTAMP NOT NULL DEFAULT now(), "end_time" TIMESTAMP NOT NULL DEFAULT now(), "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "passengerId" integer, "driverId" integer, CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_a4d572e126f5475433560c9a370" FOREIGN KEY ("passengerId") REFERENCES "passengers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_fc5a8911f85074a660a4304baa1" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_fc5a8911f85074a660a4304baa1"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_a4d572e126f5475433560c9a370"`);
        await queryRunner.query(`DROP TABLE "trips"`);
    }

}
