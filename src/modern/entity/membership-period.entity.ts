import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Membership } from "./membership.entity";

@Entity("membership_periods")
export class MembershipPeriod {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid", unique: true })
    uuid: string;

    @Column()
    membershipId: number;

    @Column({ type: "timestamp" })
    start: Date;

    @Column({ type: "timestamp" })
    end: Date;

    @Column()
    state: string;

    @ManyToOne(() => Membership, membership => membership.periods, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "membershipId" })
    membership: Membership;
} 