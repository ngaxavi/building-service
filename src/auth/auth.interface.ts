import { Request } from 'express';

export interface User {
  id?: string;
  name?: string;
  clientId?: string;
  roles?: string[];
  resourceRoles?: string[];
}

export interface ExtendedRequest extends Request {
  user: User;
}

