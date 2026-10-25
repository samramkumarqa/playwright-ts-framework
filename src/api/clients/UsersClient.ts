import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { NewUser } from '../models/user';

/**
 * Thin wrapper around the GoRest /users endpoints.
 * It returns raw APIResponse objects so tests can assert on status codes,
 * headers and bodies themselves; the client only owns URLs and payload shapes.
 */
export class UsersClient {
  private readonly basePath = '/public/v2/users';

  constructor(private readonly request: APIRequestContext) {}

  list(params?: Record<string, string | number>): Promise<APIResponse> {
    return this.request.get(this.basePath, { params });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`${this.basePath}/${id}`);
  }

  create(user: NewUser): Promise<APIResponse> {
    return this.request.post(this.basePath, { data: user });
  }

  /** PUT: full update. GoRest accepts partial bodies on PUT too. */
  update(id: number, changes: Partial<NewUser>): Promise<APIResponse> {
    return this.request.put(`${this.basePath}/${id}`, { data: changes });
  }

  /** PATCH: partial update. */
  patch(id: number, changes: Partial<NewUser>): Promise<APIResponse> {
    return this.request.patch(`${this.basePath}/${id}`, { data: changes });
  }

  delete(id: number): Promise<APIResponse> {
    return this.request.delete(`${this.basePath}/${id}`);
  }
}
