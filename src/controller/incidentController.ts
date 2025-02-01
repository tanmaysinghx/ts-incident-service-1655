import { Request, Response } from 'express';
import * as incidentService from '../services/incidentService';
import { ApiResponse } from '../utils/apiResponse';

export const createIncidentController = async (req: Request, res: Response) => {
    try {
        const { title, description, priority } = req.body;
        const createdBy = (req as any).user.email; // From JWT
        const incident = await incidentService.createIncidentService({
            title,
            description,
            priority,
            createdBy,
        });
        res.status(201).json(new ApiResponse('Incident created', incident));
    } catch (error: any) {
        res.status(500).json(new ApiResponse(error.message, null, 500));
    }
};

// Implement other controllers (getById, list, etc.)