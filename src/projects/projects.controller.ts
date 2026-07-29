import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    // ---- PUBLIC (frontend için) ----
    @Get()
    findAll() {
        return this.projectsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    // ---- ADMIN (JWT gerekli) ----
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        }),
    )
    create(
        @Body() dto: CreateProjectDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.projectsService.create(dto, files);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        }),
    )
    update(
        @Param('id') id: string,
        @Body() dto: UpdateProjectDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.projectsService.update(id, dto, files);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectsService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('images/:imageId')
    removeImage(@Param('imageId') imageId: string) {
        return this.projectsService.removeImage(imageId);
    }
}