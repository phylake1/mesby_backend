import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(
        private prisma: PrismaService,
        private cloudinary: CloudinaryService,
    ) { }

    findAll() {
        return this.prisma.project.findMany({
            include: { images: { orderBy: { order: 'asc' } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: { images: { orderBy: { order: 'asc' } } },
        });
        if (!project) throw new NotFoundException('Proje bulunamadı');
        return project;
    }

    async create(dto: CreateProjectDto, files: Express.Multer.File[]) {
        const project = await this.prisma.project.create({ data: dto });

        if (files?.length) {
            await this.attachImages(project.id, files);
        }

        return this.findOne(project.id);
    }

    async update(id: string, dto: UpdateProjectDto, files?: Express.Multer.File[]) {
        await this.findOne(id); // yoksa 404 fırlatır

        await this.prisma.project.update({ where: { id }, data: dto });

        if (files?.length) {
            await this.attachImages(id, files);
        }

        return this.findOne(id);
    }

    async remove(id: string) {
        const project = await this.findOne(id);

        // Cloudinary'den görselleri sil
        await Promise.all(
            project.images.map((img) => this.cloudinary.deleteImage(img.publicId)),
        );

        return this.prisma.project.delete({ where: { id } });
    }

    async removeImage(imageId: string) {
        const image = await this.prisma.projectImage.findUnique({ where: { id: imageId } });
        if (!image) throw new NotFoundException('Görsel bulunamadı');

        await this.cloudinary.deleteImage(image.publicId);
        return this.prisma.projectImage.delete({ where: { id: imageId } });
    }

    private async attachImages(projectId: string, files: Express.Multer.File[]) {
        const uploads = await Promise.all(
            files.map((file) => this.cloudinary.uploadImage(file)),
        );

        await this.prisma.projectImage.createMany({
            data: uploads.map((res, index) => ({
                projectId,
                url: res.secure_url,
                publicId: res.public_id,
                order: index,
            })),
        });
    }
}