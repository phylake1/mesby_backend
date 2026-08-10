import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsArray, MaxLength, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    description!: string;

    @IsEnum(ProjectStatus)
    status!: ProjectStatus;

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
    @MaxLength(100)
    city!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    district!: string;

    @IsArray()
    @ArrayMaxSize(30)
    @IsString({ each: true })
    @MaxLength(200, { each: true })
    features!: string[];
}