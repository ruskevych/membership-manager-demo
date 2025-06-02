import express from 'express';
import { MembershipController } from './controller/membership.controller';
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.use(express.json());

// Routes
const membershipController = new MembershipController();
app.get('/memberships', membershipController.getAllMemberships.bind(membershipController));
app.get('/memberships/:id', membershipController.getMembershipById.bind(membershipController));
app.post('/memberships', membershipController.createMembership.bind(membershipController));
app.put('/memberships/:id', membershipController.updateMembership.bind(membershipController));
app.delete('/memberships/:id', membershipController.deleteMembership.bind(membershipController));

// Error handling middleware should be last
app.use(errorHandler);

export default app; 