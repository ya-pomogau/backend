import { AnyUserInterface } from '../user.types';

declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AuthInfo {}
    interface Request {
      authInfo?: AuthInfo | undefined;
      user?: Record<string, unknown> | AnyUserInterface | undefined;
    }
  }
}

export {};
