import { env } from '../config/env';

export interface UiUser {
  username: string;
  password: string;
}

/** The demo accounts SauceDemo provides, each with a different behaviour. */
export const users = {
  standard: { username: 'standard_user', password: env.uiPassword },
  lockedOut: { username: 'locked_out_user', password: env.uiPassword },
  problem: { username: 'problem_user', password: env.uiPassword },
  invalid: { username: 'no_such_user', password: 'wrong_password' },
} satisfies Record<string, UiUser>;

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redTShirt: 'Test.allTheThings() T-Shirt (Red)',
} as const;

export type ProductName = (typeof products)[keyof typeof products];
