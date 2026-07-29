import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
    catch(exception: MulterError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception.code === 'LIMIT_FILE_SIZE') {
            return response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
                statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
                message: 'Yüklenen görsel 5MB sınırını aşıyor.',
            });
        }

        return response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Dosya yükleme hatası: ${exception.message}`,
        });
    }
}