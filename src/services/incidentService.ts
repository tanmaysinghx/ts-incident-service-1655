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

interface ListIncidentsParams {
    status?: IncidentStatus;
    priority?: IncidentPriority;
    page?: number;
    size?: number;
}

interface UpdateStatusInput {
    id: string;
    status: IncidentStatus;
    comment?: string;
    updatedBy: string;
}

export const createIncidentService = async (input: CreateIncidentInput) => {
    return await prisma.incident.create({
        data: {
            ...input,
            status: 'OPEN',
        },
    });
};

export const getIncidentById = async (id: string) => {
    return await prisma.incident.findUnique({
        where: { id },
        include: {
            comments: true,
        },
    });
};

export const listIncidents = async ({
    status,
    priority,
    page = 1,
    size = 10,
}: ListIncidentsParams) => {
    const skip = (page - 1) * size;
    const where = {
        ...(status && { status }),
        ...(priority && { priority }),
    };
    const [incidents, total] = await prisma.$transaction([
        prisma.incident.findMany({
            where,
            skip,
            take: size,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.incident.count({ where }),
    ]);

    return { incidents, total, page, size };
};

export const updateIncidentStatus = async ({
    id,
    status,
    comment,
    updatedBy,
}: UpdateStatusInput) => {
    const isResolvedOrClosed = status === 'RESOLVED' || status === 'CLOSED';
    return await prisma.incident.update({
        where: { id },
        data: {
            status,
            resolvedAt: isResolvedOrClosed ? new Date() : null,
            comments: comment
                ? {
                    create: {
                        text: comment,
                        postedBy: updatedBy,
                    },
                }
                : undefined,
        },
        include: { comments: true }, 
    });
};

// Implement other service methods (getById, list, updateStatus, etc.)