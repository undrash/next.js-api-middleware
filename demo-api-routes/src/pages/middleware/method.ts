import { NextApiRequest, NextApiResponse } from 'next';
import { Middleware, NextFunction } from './handler';

type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const allowMethods =
  (allowedMethods: HttpVerb[]): Middleware =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    if (allowedMethods.includes(req.method as HttpVerb)) {
      next();
    } else {
      res.status(405).send({
        error: `Endpoint does not support requests of type '${req.method}'.`,
      });
    }
  };
