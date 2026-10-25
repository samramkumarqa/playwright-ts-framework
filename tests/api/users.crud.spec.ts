import { test, expect } from '../../src/fixtures';
import { buildUser } from '../../src/api/factories/userFactory';
import type { FieldError, User } from '../../src/api/models/user';

// Write operations need GOREST_TOKEN. The `usersApi` fixture skips them when it is missing.
test.describe('Users API: POST / PUT / PATCH / DELETE', () => {
  test('full lifecycle: create, read, update, delete @smoke', async ({ usersApi, cleanupUserIds }) => {
    const newUser = buildUser();
    let created!: User;

    await test.step('POST creates the user', async () => {
      const response = await usersApi.create(newUser);
      expect(response.status()).toBe(201);
      created = (await response.json()) as User;
      cleanupUserIds.push(created.id);
      expect(created).toMatchObject(newUser);
      expect(created.id).toEqual(expect.any(Number));
    });

    await test.step('GET returns what was created', async () => {
      const response = await usersApi.get(created.id);
      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual(created);
    });

    await test.step('PUT updates name and status', async () => {
      const changes = { name: `${newUser.name} Updated`, status: 'inactive' as const };
      const response = await usersApi.update(created.id, changes);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({ ...created, ...changes });
    });

    await test.step('PATCH changes a single field', async () => {
      const response = await usersApi.patch(created.id, { gender: created.gender === 'male' ? 'female' : 'male' });
      expect(response.status()).toBe(200);
      const patched = (await response.json()) as User;
      expect(patched.gender).not.toBe(created.gender);
      expect(patched.email).toBe(created.email);
    });

    await test.step('DELETE removes the user', async () => {
      const response = await usersApi.delete(created.id);
      expect(response.status()).toBe(204);
      expect(await response.text()).toBe('');
    });

    await test.step('GET after delete returns 404', async () => {
      const response = await usersApi.get(created.id);
      expect(response.status()).toBe(404);
    });
  });

  test('POST rejects a duplicate email with 422', async ({ usersApi, cleanupUserIds }) => {
    const user = buildUser();
    const first = await usersApi.create(user);
    expect(first.status()).toBe(201);
    cleanupUserIds.push(((await first.json()) as User).id);

    const duplicate = await usersApi.create(buildUser({ email: user.email }));
    expect(duplicate.status()).toBe(422);
    expect(await duplicate.json()).toContainEqual({ field: 'email', message: 'has already been taken' });
  });

  test('POST reports every missing required field', async ({ usersApi }) => {
    const response = await usersApi.create({} as never);
    expect(response.status()).toBe(422);

    const errors = (await response.json()) as FieldError[];
    const fields = errors.map((e) => e.field).sort();
    expect(fields).toEqual(['email', 'gender', 'name', 'status']);
  });

  test('PUT on an unknown user returns 404', async ({ usersApi }) => {
    const response = await usersApi.update(1, { name: 'Nobody' });
    expect(response.status()).toBe(404);
  });
});

test.describe('Users API: auth', () => {
  test('POST without a token returns 401', async ({ publicUsersApi }) => {
    const response = await publicUsersApi.create(buildUser());
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Authentication failed' });
  });
});
