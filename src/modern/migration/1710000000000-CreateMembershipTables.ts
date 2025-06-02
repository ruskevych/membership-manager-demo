import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMembershipTables1710000000000 implements MigrationInterface {
    name = 'CreateMembershipTables1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "memberships" (
                "id" SERIAL PRIMARY KEY,
                "uuid" UUID NOT NULL UNIQUE,
                "name" VARCHAR NOT NULL,
                "userId" INTEGER NOT NULL,
                "recurringPrice" DECIMAL(10,2) NOT NULL,
                "validFrom" TIMESTAMP NOT NULL,
                "validUntil" TIMESTAMP NOT NULL,
                "state" VARCHAR NOT NULL,
                "assignedBy" VARCHAR NOT NULL,
                "paymentMethod" VARCHAR,
                "billingInterval" VARCHAR NOT NULL,
                "billingPeriods" INTEGER NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "membership_periods" (
                "id" SERIAL PRIMARY KEY,
                "uuid" UUID NOT NULL UNIQUE,
                "membershipId" INTEGER NOT NULL,
                "start" TIMESTAMP NOT NULL,
                "end" TIMESTAMP NOT NULL,
                "state" VARCHAR NOT NULL,
                CONSTRAINT "fk_membership" FOREIGN KEY ("membershipId") 
                    REFERENCES "memberships"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "membership_periods"`);
        await queryRunner.query(`DROP TABLE "memberships"`);
    }
} 