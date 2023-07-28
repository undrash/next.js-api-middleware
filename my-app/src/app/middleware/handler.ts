import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server'


export type NextFunction = () => void;

export type Middleware<
  RequestMiddleware extends NextApiRequest = NextApiRequest,
> = (
  req: RequestMiddleware,
  res: NextApiResponse,
  next: NextFunction,
) => Promise<void>;

const execMiddlewares = async <RequestMiddleware extends NextApiRequest>(
  req: RequestMiddleware,
  res: NextApiResponse,
  // middlewares: Middleware<RequestMiddleware>[],
  middlewares: any[],
  index = 0,
  resolve: (res?: any) => void,
  reject: (err: Error) => void,
) => {
  // It never resolves because of this...
  if (res.headersSent) return resolve();

  if (index == middlewares.length - 1) {
    const response = middlewares[index](req);
    return resolve(response);
  }

  await middlewares[index](req, res, () => {
    index++;

    const next = middlewares[index];

    if (!next) return resolve();

    if (typeof next !== 'function') {
      res.status(500).end();
      return reject(new Error('Middleware must be a function!'));
    }

    return execMiddlewares(req, res, middlewares, index, resolve, reject);
  });
};

export const handler =
  <RequestMiddleware extends NextApiRequest>(
    ...middlewares: Middleware<RequestMiddleware>[]
  ) =>
  async (req: RequestMiddleware, res: NextApiResponse) => {
    console.log('Tries to run handler')
    // return new Promise<void>((resolve, reject) => {
    //   return execMiddlewares(req, res, middlewares, 0, resolve, reject);
    // });


    const result = await new Promise<any>((resolve, reject) => {
      execMiddlewares(req, res, middlewares, 0, resolve, reject);
    });

    // console.log('result', result);
    

    return result
  };
