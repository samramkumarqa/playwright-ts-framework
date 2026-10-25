export type Gender = 'male' | 'female';
export type UserStatus = 'active' | 'inactive';

/** Payload accepted by POST /public/v2/users. */
export type NewUser = {
  name: string;
  email: string;
  gender: Gender;
  status: UserStatus;
};

/** A user as returned by the API. */
export type User = NewUser & {
  id: number;
};

/** Shape of GoRest validation errors (HTTP 422). */
export interface FieldError {
  field: string;
  message: string;
}

/** Lightweight runtime check so tests fail clearly if the response contract changes. */
export function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.name === 'string' &&
    typeof v.email === 'string' &&
    (v.gender === 'male' || v.gender === 'female') &&
    (v.status === 'active' || v.status === 'inactive')
  );
}
