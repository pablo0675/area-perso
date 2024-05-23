import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupUserSettings1711447316612 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TYPE "theme_enum" AS ENUM ('auto', 'light', 'dark');
    CREATE TYPE "language_enum" AS ENUM ('English', 'French', 'Spanish');
    CREATE TABLE "user_settings" (
        "userId" UUID NOT NULL,
        "theme" "theme_enum" NOT NULL DEFAULT 'auto',
        "language" "language_enum" NOT NULL DEFAULT 'English',
        CONSTRAINT "pk_user_settings_userId" PRIMARY KEY ("userId"),
        CONSTRAINT "fk_user_settings_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
    )
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE "user_settings";
    DROP TYPE "theme_enum";
    DROP TYPE "language_enum";
`);
  }
}
