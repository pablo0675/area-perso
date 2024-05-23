import { MigrationInterface, QueryRunner } from 'typeorm';

export default class Migration1710950053869 implements MigrationInterface {
  name = 'Migration1710950053869';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" VARCHAR(255) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    )`,
    );

    await queryRunner.query(
      `CREATE TYPE "service_name_enum" AS ENUM('riot', 'google', 'github', 'twitter', 'facebook', 'linkedin')`,
    );

    await queryRunner.query(`
        CREATE TABLE "service" (
            "id" service_name_enum NOT NULL,
            "imageUrl" VARCHAR(255) NOT NULL,
            "oauthUrl" VARCHAR(255) NOT NULL,
            "needConnection" BOOLEAN NOT NULL DEFAULT true,
            CONSTRAINT "PK_0e0e4f3a3f3e4b6b4f63e4f2d1d"
            PRIMARY KEY ("id")
        )
    `);

    await queryRunner.query(`
        CREATE TABLE "user_connection" (
            "userId" UUID NOT NULL,
            "serviceId" service_name_enum NOT NULL,
            "data" JSONB NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "PK_user_connection" PRIMARY KEY ("userId", "serviceId"),
            CONSTRAINT "FK_user_connection_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_user_connection_service" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE
        )
    `);

    await queryRunner.query(`
        CREATE TABLE "area" (
            "id" VARCHAR NOT NULL,
            "serviceId" service_name_enum NOT NULL,
            "isAction" BOOLEAN NOT NULL,
            "params" JSONB NOT NULL DEFAULT '[]',
            "returnParams" TEXT[] NOT NULL DEFAULT '{}',
            "description" TEXT NOT NULL DEFAULT 'description of the area',
            CONSTRAINT "pk_area_id_serviceId" PRIMARY KEY ("id", "serviceId"),
            CONSTRAINT "fk_area_service" FOREIGN KEY ("serviceId") REFERENCES "service" ("id") ON DELETE CASCADE
        )
    `);

    await queryRunner.query(`
        CREATE TABLE "scope" (
            "id" VARCHAR NOT NULL,
            "serviceId" service_name_enum NOT NULL,
            CONSTRAINT "pk_scope_id" PRIMARY KEY ("id"),
            CONSTRAINT "fk_scope_service" FOREIGN KEY ("serviceId") REFERENCES "service" ("id") ON DELETE CASCADE
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_connection" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "area" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "scope" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "service" CASCADE`);
    await queryRunner.query(`DROP TYPE "service_name_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
