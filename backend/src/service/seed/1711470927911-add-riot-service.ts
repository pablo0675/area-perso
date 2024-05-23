import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRiotService1711470927911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "service" ("id", "imageUrl", "oauthUrl", "needConnection")
             VALUES ('riot',
                     'https://i.pinimg.com/originals/90/6d/23/906d231cbaff55c77fb97191592e1c76.png',
                     'nothing',
                      'false'
                     )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /*await queryRunner.query(
      `DELETE FROM "service"
             WHERE id = 'riot'`,
    );*/
  }
}
