import express from 'express';
import { MembershipController } from '../controller/membership.controller';

const router = express.Router();
const membershipController = new MembershipController();

router.get('/', (req, res, next) => membershipController.getAllMemberships(req, res, next));
router.get('/:id', (req, res, next) => membershipController.getMembershipById(req, res, next));
router.post('/', (req, res, next) => membershipController.createMembership(req, res, next));
router.put('/:id', (req, res, next) => membershipController.updateMembership(req, res, next));
router.delete('/:id', (req, res, next) => membershipController.deleteMembership(req, res, next));
router.get('/:id/periods', (req, res, next) => membershipController.getMembershipPeriods(req, res, next));

export default router;
