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

interface AssignIncidentInput {
    id: string;
    assignedTo: string;
    comment?: string;
    assignedBy: string
}

interface SearchIncidentsParams {
    query: string;
    status?: IncidentStatus;
    priority?: IncidentPriority;
    page?: number;
    size?: number;
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

export const assignIncident = async ({
    id,
    assignedTo,
    comment,
    assignedBy,
}: AssignIncidentInput) => {
    return await prisma.incident.update({
        where: { id },
        data: {
            assignedTo,
            comments: comment
                ? {
                    create: {
                        text: comment,
                        postedBy: assignedBy,
                    },
                }
                : undefined,
        },
        include: { comments: true },
    });
};

export const searchIncidents = async ({
    query,
    status,
    priority,
    page = 1,
    size = 10,
}: SearchIncidentsParams) => {
    const skip = (page - 1) * size;
    const where = {
        AND: [
            {
                OR: [
                    { title: { contains: query } }, // Case-insensitive by default in MySQL
                    { description: { contains: query } },
                ],
            },
            ...(status ? [{ status }] : []),
            ...(priority ? [{ priority }] : []),
        ],
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

// Implement other service methods (getById, list, updateStatus, etc.)