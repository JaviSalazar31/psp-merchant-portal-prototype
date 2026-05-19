export interface SecurityMockData {
  passwordLastChangedAt: Date;
  twoFactorEnabled: boolean;
}

const today = new Date('2026-05-15T12:00:00').getTime();
const days = (n: number) => n * 24 * 60 * 60 * 1000;

export const MOCK_SECURITY: SecurityMockData = {
  passwordLastChangedAt: new Date(today - days(35)),
  twoFactorEnabled: false,
};
