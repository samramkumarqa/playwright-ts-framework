import { faker } from '@faker-js/faker';
import type { NewUser } from '../models/user';

/**
 * Builds a valid, unique user. Pass overrides to set only the fields a test cares about.
 * Emails get a timestamp + random suffix so parallel runs never collide.
 */
export function buildUser(overrides: Partial<NewUser> = {}): NewUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const unique = `${Date.now()}${faker.string.alphanumeric(5).toLowerCase()}`;

  return {
    name: `${firstName} ${lastName}`,
    email: `pw.${firstName.toLowerCase()}.${unique}@example.com`,
    gender: faker.helpers.arrayElement(['male', 'female'] as const),
    status: 'active',
    ...overrides,
  };
}
