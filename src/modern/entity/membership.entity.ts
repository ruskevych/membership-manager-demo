import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { MembershipPeriod } from "./membership-period.entity";

@Entity("memberships")
export class Membership {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid", unique: true })
    uuid: string;

    @Column()
    name: string;

    @Column()
    userId: number;

    @Column("decimal", { precision: 10, scale: 2 })
    recurringPrice: number;

    @Column({ type: "timestamp" })
    validFrom: Date;

    @Column({ type: "timestamp" })
    validUntil: Date;

    @Column()
    state: string;

    @Column()
    assignedBy: string;

    @Column({ nullable: true, type: 'varchar' })
    paymentMethod: string | null;

    @Column()
    billingInterval: string;

    @Column()
    billingPeriods: number;

    @OneToMany(() => MembershipPeriod, period => period.membership)
    periods?: MembershipPeriod[];
} 