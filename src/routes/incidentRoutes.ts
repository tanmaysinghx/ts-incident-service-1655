import { Router } from 'express';
import { createIncidentController, getIncidentById, listIncidents, updateIncidentStatus } from '../controller/incidentController';
import { validateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-incident', validateJWT, createIncidentController);
router.get('/get-incident/:id', getIncidentById);
router.get('/get-incident-list', listIncidents);
router.patch('/update-incident/:id/status', validateJWT, updateIncidentStatus);
// router.patch('/:id/assign', assignIncident);
// router.get('/search', searchIncidents);

export default router;