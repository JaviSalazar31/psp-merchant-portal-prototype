import { INDUSTRIES, MONTHLY_VOLUME_RANGES } from '@/constants/industries';

export interface AccountCompany {
  commercialName: string;
  legalName: string;
  fiscalCountry: string;
  fiscalId: string;
  industry: (typeof INDUSTRIES)[number];
  monthlyVolume: (typeof MONTHLY_VOLUME_RANGES)[number];
}

export interface AccountContact {
  corporateEmail: string;
  phonePrefix: string;
  phone: string;
  website: string;
}

export interface AccountAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface AccountBank {
  bankName: string;
  accountHolder: string;
  accountNumberMasked: string;
  currency: string;
  routingOrIban: string;
}

export interface AccountData {
  company: AccountCompany;
  contact: AccountContact;
  operationCountries: string[];
  addresses: Record<string, AccountAddress>;
  banks: Record<string, AccountBank>;
}

// Account asociada al usuario admin (Bruno Fernández — Tacos Pancho MX, approved).
// El portal hoy soporta multi-país a nivel datos, pero Tacos Pancho opera solo en MX.
export const MOCK_ACCOUNT: AccountData = {
  company: {
    commercialName: 'Tacos Pancho',
    legalName: 'Tacos Pancho S.A. de C.V.',
    fiscalCountry: 'MX',
    fiscalId: 'TPA050415XYZ',
    industry: 'Retail',
    monthlyVolume: '$100K-500K',
  },
  contact: {
    corporateEmail: 'contacto@tacospancho.mx',
    phonePrefix: '+52',
    phone: '55 1234 5678',
    website: 'tacospancho.mx',
  },
  operationCountries: ['MX'],
  addresses: {
    MX: {
      line1: 'Av. Insurgentes Sur 1234',
      line2: 'Piso 8, Col. Del Valle',
      city: 'Ciudad de México',
      state: 'CDMX',
      zip: '03100',
      country: 'MX',
    },
  },
  banks: {
    MX: {
      bankName: 'BBVA México',
      accountHolder: 'Tacos Pancho S.A. de C.V.',
      accountNumberMasked: '**** **** **** 4321',
      currency: 'MXN',
      routingOrIban: 'CLABE 012 180 01234567890 4',
    },
  },
};
