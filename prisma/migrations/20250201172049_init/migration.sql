-- CreateTable
CREATE TABLE `Incident` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `assignedTo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `resolvedAt` DATETIME(3) NULL,
    `slaStatus` ENUM('UNDER_SLA', 'BRECHED') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `postedBy` VARCHAR(191) NOT NULL,
    `postedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `incidentId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `Incident`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
