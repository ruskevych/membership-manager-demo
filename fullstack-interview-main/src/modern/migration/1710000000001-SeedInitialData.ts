import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialData1710000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert memberships
        await queryRunner.query(`
            INSERT INTO memberships (id, uuid, name, "userId", "recurringPrice", "validFrom", "validUntil", state, "assignedBy", "paymentMethod", "billingInterval", "billingPeriods")
            VALUES 
            (1, '123e4567-e89b-12d3-a456-426614174000', 'Platinum Plan', 2000, 150.0, '2023-01-01', '2023-12-31', 'active', 'Admin', 'credit card', 'monthly', 12),
            (2, '123e4567-e89b-12d3-a456-426614174001', 'Gold Plan', 2000, 100.0, '2023-02-01', '2023-12-31', 'active', 'Admin', 'cash', 'monthly', 2),
            (3, '123e4567-e89b-12d3-a456-426614174002', 'Gold Plan', 2000, 100.0, '2023-02-01', '2023-12-31', 'active', 'Admin', null, 'monthly', 6)
        `);

        // Reset the membership id sequence
        await queryRunner.query(`SELECT setval('memberships_id_seq', (SELECT MAX(id) FROM memberships))`);

        // Insert membership periods
        await queryRunner.query(`
            INSERT INTO membership_periods (id, uuid, "membershipId", start, "end", state)
            VALUES 
            (1, '123e4567-e89b-12d3-a456-426614174000', 1, '2023-01-01', '2023-01-31', 'issued'),
            (2, '123e4567-e89b-12d3-a456-426614174001', 2, '2023-02-01', '2023-02-28', 'issued'),
            (3, '123e4567-e89b-12d3-a456-426614174002', 3, '2023-03-01', '2023-03-31', 'issued')
        `);

        // Reset the membership_periods id sequence
        await queryRunner.query(`SELECT setval('membership_periods_id_seq', (SELECT MAX(id) FROM membership_periods))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove all seeded data
        await queryRunner.query(`DELETE FROM membership_periods`);
        await queryRunner.query(`DELETE FROM memberships`);
        
        // Reset sequences
        await queryRunner.query(`SELECT setval('membership_periods_id_seq', 1)`);
        await queryRunner.query(`SELECT setval('memberships_id_seq', 1)`);
    }
} 