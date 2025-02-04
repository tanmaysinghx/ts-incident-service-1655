import { Request, Response } from 'express';
import * as incidentService from '../services/incidentService';
import { ApiResponse } from '../utils/apiResponse';
import { IncidentPriority, IncidentStatus, Prisma } from '@prisma/client';

export const createIncidentController = async (req: Request, res: Response) => {
    try {
        const { title, description, priority, status, assignedTo, slaStatus } = req.body;
        const createdBy = (req as any).user.email; // From JWT
        const incident = await incidentService.createIncidentService({
            title,
            description,
            priority,
            createdBy,
            status,
            assignedTo,
            slaStatus
        });
        res.status(201).json(new ApiResponse('Incident created', incident));
    } catch (error: any) {
        res.status(500).json(new ApiResponse(error.message, null, 500));
    }
};

export const getIncidentById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const incident = await incidentService.getIncidentById(id);
        if (!incident) {
            res.status(404).json(new ApiResponse('Incident not found', null, 404));
            return;
        }
        res.status(200).json(new ApiResponse('Incident fetched', incident));
    } catch (error: any) {
        res.status(500).json(new ApiResponse(error.message, null, 500));
    }
};

export const listIncidents = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { status, priority } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;

        const result = await incidentService.listIncidents({
            status: status as IncidentStatus | undefined,
            priority: priority as IncidentPriority | undefined,
            page,
            size,
        });
        res.status(200).json(
            new ApiResponse('Incidents fetched', {
                data: result.incidents,
                pagination: {
                    total: result.total,
                    page: result.page,
                    size: result.size,
                },
            })
        );
    } catch (error: any) {
        res.status(500).json(new ApiResponse(error.message, null, 500));
    }
};

export const updateIncidentStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, comment } = req.body;
        const updatedBy = (req as any).user.email;
        if (!Object.values(IncidentStatus).includes(status)) {
            res.status(400).json(new ApiResponse('Invalid status', null, 400));
            return;
        }
        const updatedIncident = await incidentService.updateIncidentStatus({
            id,
            status,
            comment,
            updatedBy,
        });
        res
            .status(200)
            .json(new ApiResponse('Status updated', updatedIncident));
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json(new ApiResponse('Incident not found', null, 404));
                return;
            }
        }
        res.status(500).json(new ApiResponse(error.message, null, 500));
    }
};

export const assignIncident = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { assignedTo, comment } = req.body;
        const assignedBy = (req as any).user.email;
        if (!assignedTo) {
            res.status(400).json(new ApiResponse('Assignee ID is required', null, 400));
            return;
        }
        const updatedIncident = await incidentService.assignIncident({
            id,
            assignedTo,
            comment,
            assignedBy,
        });
        res.status(200).json(new ApiResponse('Incident assigned', updatedIncident));
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json(new ApiResponse('Incident not found', null, 404));
                return;
            }
        }
        res.status(500).json(new ApiResponse(error.message, null, 500));
    }
};

// Implement other controllers (getById, list, etc.)