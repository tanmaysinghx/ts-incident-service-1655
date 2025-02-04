import { Router } from 'express';
import { assignIncident, createIncidentController, getIncidentById, listIncidents, searchIncidents, updateIncidentStatus } from '../controller/incidentController';
import { validateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-incident', validateJWT, createIncidentController);
router.get('/get-incident/:id', getIncidentById);
router.get('/get-incident-list', listIncidents);
router.patch('/update-incident/:id/status', validateJWT, updateIncidentStatus);
router.patch('/assign-incident/:id/assign', validateJWT, assignIncident);
router.get('/search', searchIncidents);

export default router;