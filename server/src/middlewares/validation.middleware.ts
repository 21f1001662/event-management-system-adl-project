import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export function validationMiddleware<T extends object>(type: new () => T, source: 'body' | 'query' | 'params' = 'body'): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        const dtoObj = plainToInstance(type, req[source]);
        validate(dtoObj).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                const message = errors.map((error: ValidationError) => Object.values(error.constraints || {})).join(', ');
                res.status(400).json({ message });
            } else {
                next();
            }
        });
    };
}
