export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  city: string;
  country: string;
  ipMasked: string;
  lastActivityAt: Date;
  isCurrent: boolean;
}

export interface LoginActivityEntry {
  id: string;
  timestamp: Date;
  ipMasked: string;
  city: string;
  country: string;
  browser: string;
  os: string;
  result: 'success' | 'failed';
}

export interface SecurityMockData {
  passwordLastChangedAt: Date;
  twoFactorEnabled: boolean;
  activeSessions: ActiveSession[];
  loginActivity: LoginActivityEntry[];
}

const today = new Date('2026-05-15T12:00:00').getTime();
const mins = (n: number) => n * 60 * 1000;
const hours = (n: number) => n * 60 * 60 * 1000;
const days = (n: number) => n * 24 * 60 * 60 * 1000;

export const MOCK_SECURITY: SecurityMockData = {
  passwordLastChangedAt: new Date(today - days(35)),
  twoFactorEnabled: false,
  activeSessions: [
    {
      id: 'ses_1',
      device: 'Desktop',
      browser: 'Chrome 132',
      os: 'Windows 11',
      city: 'Buenos Aires',
      country: 'AR',
      ipMasked: '181.45.***.***',
      lastActivityAt: new Date(today),
      isCurrent: true,
    },
    {
      id: 'ses_2',
      device: 'Desktop',
      browser: 'Chrome 131',
      os: 'macOS Sonoma',
      city: 'Ciudad de México',
      country: 'MX',
      ipMasked: '189.203.***.***',
      lastActivityAt: new Date(today - days(2)),
      isCurrent: false,
    },
    {
      id: 'ses_3',
      device: 'Mobile',
      browser: 'Safari 17',
      os: 'iOS 18',
      city: 'Buenos Aires',
      country: 'AR',
      ipMasked: '181.45.***.***',
      lastActivityAt: new Date(today - hours(5)),
      isCurrent: false,
    },
  ],
  loginActivity: [
    {
      id: 'la_1',
      timestamp: new Date(today - mins(15)),
      ipMasked: '181.45.***.***',
      city: 'Buenos Aires',
      country: 'AR',
      browser: 'Chrome 132',
      os: 'Windows 11',
      result: 'success',
    },
    {
      id: 'la_2',
      timestamp: new Date(today - hours(5)),
      ipMasked: '181.45.***.***',
      city: 'Buenos Aires',
      country: 'AR',
      browser: 'Safari 17',
      os: 'iOS 18',
      result: 'success',
    },
    {
      id: 'la_3',
      timestamp: new Date(today - days(1) - hours(3)),
      ipMasked: '181.45.***.***',
      city: 'Buenos Aires',
      country: 'AR',
      browser: 'Chrome 132',
      os: 'Windows 11',
      result: 'success',
    },
    {
      id: 'la_4',
      timestamp: new Date(today - days(2)),
      ipMasked: '189.203.***.***',
      city: 'Ciudad de México',
      country: 'MX',
      browser: 'Chrome 131',
      os: 'macOS Sonoma',
      result: 'success',
    },
    {
      id: 'la_5',
      timestamp: new Date(today - days(3) - hours(2)),
      ipMasked: '186.13.***.***',
      city: 'Rosario',
      country: 'AR',
      browser: 'Firefox 130',
      os: 'Ubuntu 24',
      result: 'failed',
    },
    {
      id: 'la_6',
      timestamp: new Date(today - days(4)),
      ipMasked: '181.45.***.***',
      city: 'Buenos Aires',
      country: 'AR',
      browser: 'Chrome 132',
      os: 'Windows 11',
      result: 'success',
    },
    {
      id: 'la_7',
      timestamp: new Date(today - days(5) - hours(8)),
      ipMasked: '181.45.***.***',
      city: 'Buenos Aires',
      country: 'AR',
      browser: 'Chrome 132',
      os: 'Windows 11',
      result: 'success',
    },
    {
      id: 'la_8',
      timestamp: new Date(today - days(7)),
      ipMasked: '181.45.***.***',
      city: 'Buenos Aires',
      country: 'AR',
      browser: 'Chrome 131',
      os: 'Windows 11',
      result: 'success',
    },
    {
      id: 'la_9',
      timestamp: new Date(today - days(9)),
      ipMasked: '186.13.***.***',
      city: 'Rosario',
      country: 'AR',
      browser: 'Chrome 131',
      os: 'Windows 11',
      result: 'success',
    },
    {
      id: 'la_10',
      timestamp: new Date(today - days(12)),
      ipMasked: '181.45.***.***',
      city: 'Buenos Aires',
      country: 'AR',
      browser: 'Chrome 131',
      os: 'Windows 11',
      result: 'success',
    },
  ],
};
