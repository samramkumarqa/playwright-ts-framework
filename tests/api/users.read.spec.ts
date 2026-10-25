import { test, expect } from '../../src/fixtures';
import { isUser, type User } from '../../src/api/models/user';

// Public reads: no token needed, so these always run.
test.describe('Users API: GET', () => {
  test('lists users with a valid contract @smoke', async ({ publicUsersApi }) => {
    const response = await publicUsersApi.list();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body: unknown = await response.json();
    expect(Array.isArray(body)).toBe(true);
    const list = body as unknown[];
    expect(list.length).toBeGreaterThan(0);
    for (const user of list) {
      expect(isUser(user), `invalid user shape: ${JSON.stringify(user)}`).toBe(true);
    }
  });

  test('exposes pagination headers', async ({ publicUsersApi }) => {
    const response = await publicUsersApi.list({ page: 1, per_page: 5 });
    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers['x-pagination-page']).toBe('1');
    expect(headers['x-pagination-limit']).toBe('5');
    expect(Number(headers['x-pagination-total'])).toBeGreaterThan(0);

    const body = (await response.json()) as User[];
    expect(body.length).toBeLessThanOrEqual(5);
  });

  test('filters by status', async ({ publicUsersApi }) => {
    const response = await publicUsersApi.list({ status: 'active' });
    expect(response.status()).toBe(200);

    const body = (await response.json()) as User[];
    expect(body.every((u) => u.status === 'active')).toBe(true);
  });

  test('fetches a single user by id', async ({ publicUsersApi }) => {
    // Pick a real id from the list instead of hardcoding one that may be deleted.
    const [first] = (await (await publicUsersApi.list()).json()) as User[];
    test.skip(!first, 'API returned no users to look up');

    const response = await publicUsersApi.get(first.id);
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ id: first.id, email: first.email });
  });

  test('returns 404 for an unknown user', async ({ publicUsersApi }) => {
    const response = await publicUsersApi.get(1);
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Resource not found' });
  });
});
