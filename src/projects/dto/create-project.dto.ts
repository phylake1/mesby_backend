import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(ProjectStatus)
    status: ProjectStatus;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    deliveryYear?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    unitCount?: number;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    district: string;

    // form-data ile string[] gönderirken JSON string olarak gelebilir,
    // controller tarafında parse ediyoruz (aşağıda).
    @IsArray()
    @IsString({ each: true })
    features: string[];
}