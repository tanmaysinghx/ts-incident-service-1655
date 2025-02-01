import { Router } from 'express';
import { createIncidentController } from '../controller/incidentController';
import { validateJWT } from '../middleware/authMiddleware';


const router = Router();

router.post('/create-incident', validateJWT, createIncidentController);
// router.get('/:id', getIncidentById);
// router.get('/', listIncidents);
// router.patch('/:id/status', updateIncidentStatus);
// router.patch('/:id/assign', assignIncident);
// router.get('/search', searchIncidents);

export default router;