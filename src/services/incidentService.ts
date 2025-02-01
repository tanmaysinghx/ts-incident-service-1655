import { IncidentStatus, IncidentPriority, SlaStatus } from '@prisma/client';
import prisma from '../config/db';

interface CreateIncidentInput {
    title: string;
    description: string;
    priority: IncidentPriority;
    createdBy: string;
    status: IncidentStatus;
    assignedTo: string;
    slaStatus: SlaStatus
}

export const createIncidentService = async (input: CreateIncidentInput) => {
    return await prisma.incident.create({
        data: {
            ...input,
            status: 'OPEN',
        },
    });
};

// Implement other service methods (getById, list, updateStatus, etc.)