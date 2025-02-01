import { IncidentStatus, IncidentPriority } from '@prisma/client';
import prisma from '../config/db';

interface CreateIncidentInput {
    title: string;
    description: string;
    priority: IncidentPriority;
    createdBy: string;
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