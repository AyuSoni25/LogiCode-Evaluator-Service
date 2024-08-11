/* eslint-disable @typescript-eslint/no-explicit-any */
// using any for the schema type here, so that this method can be reused for any schema type.
import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        ...req.body,
      });
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: 'Invalid request params reeived',
        data: {},
        error: error,
      });
    }
  };
