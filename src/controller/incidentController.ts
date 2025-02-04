import { Request, Response } from 'express';
import * as incidentService from '../services/incidentService';
import { ApiResponse } from '../utils/apiResponse';
import { IncidentPriority, IncidentStatus, Prisma } from '@prisma/client';
import { errorResponse, successResponse } from '../utils/responseUtils';

interface CustomRequest extends Request {
    transactionId?: string;
}

export const createIncidentController = async (req: CustomRequest, res: Response) => {
    const transactionId = req.transactionId;
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
        res.status(201).json(successResponse(201, incident, "Incident created", transactionId));
    } catch (error: any) {
        res.status(500).json(errorResponse(500, error.message, "null", transactionId,));
    }
};

export const getIncidentById = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    const transactionId = req.transactionId;
    try {
        const { id } = req.params;
        const incident = await incidentService.getIncidentById(id);
        if (!incident) {
            res.status(404).json(new ApiResponse('Incident not found', null, 404));
            return;
        }
        res.status(200).json(successResponse(201, incident, "Incident fetched", transactionId));
    } catch (error: any) {
        res.status(500).json(errorResponse(500, error.message, "null", transactionId,));
    }
};

export const listIncidents = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    const transactionId = req.transactionId;
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
        let customResponse = {
            data: result.incidents,
            pagination: {
                total: result.total,
                page: result.page,
                size: result.size,
            },
        };
        res.status(200).json(successResponse(200, customResponse, "Incident list fetched", transactionId));
    } catch (error: any) {
        res.status(500).json(errorResponse(500, error.message, "null", transactionId,));
    }
};

export const updateIncidentStatus = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    const transactionId = req.transactionId;
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
        res.status(200).json(successResponse(200, updatedIncident, "Status updated", transactionId));
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json(new ApiResponse('Incident not found', null, 404));
                return;
            }
        }
        res.status(500).json(errorResponse(500, error.message, "null", transactionId,));
    }
};

export const assignIncident = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    const transactionId = req.transactionId;
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
        res.status(200).json(successResponse(200, updatedIncident, "Incident assigned", transactionId));
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json(new ApiResponse('Incident not found', null, 404));
                return;
            }
        }
        res.status(500).json(errorResponse(500, error.message, "null", transactionId,));
    }
};

export const searchIncidents = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    const transactionId = req.transactionId;
    try {
        const { query, status, priority } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;
        if (!query) {
            res.status(400).json(new ApiResponse('Search query is required', null, 400));
            return;
        }
        const result = await incidentService.searchIncidents({
            query: query as string,
            status: status as IncidentStatus | undefined,
            priority: priority as IncidentPriority | undefined,
            page,
            size,
        });
        let customResponse = {
            data: result.incidents,
            pagination: {
                total: result.total,
                page: result.page,
                size: result.size,
            },
        }
        res.status(200).json(successResponse(200, customResponse, "Search Results", transactionId));
    } catch (error: any) {
        res.status(500).json(errorResponse(500, error.message, "null", transactionId,));
    }
};

// Implement other controllers (getById, list, etc.)