import { create } from 'zustand';
import { useAuthStore } from './authStore';

export interface Step1Data {
  fiscalId: string;
  fiscalResidenceCountry: string;
  incorporationCountry: string;
  commercialName: string;
  legalName: string;
  registrationNumber: string;
  corporateEmail: string;
  website: string;
  industry: string;
  monthlyVolume: string;
  operationCountries: string[];
}

export interface AddressData {
  country: string;
  city: string;
  line1: string;
  line2: string;
  zip: string;
  state: string;
  phonePrefix: string;
  phone: string;
}
export type Step2Data = Record<string, AddressData>;

export interface BankAccountData {
  bankCountry: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankAddress: string;
  /** México: CLABE de 18 dígitos. */
  clabe?: string;
  /** Brasil: número de agencia bancaria (4-5 dígitos). */
  agencyNumber?: string;
  /** Brasil/Colombia: tipo de cuenta (corriente/ahorros). */
  accountType?: 'corriente' | 'ahorros' | '';
  /** Brasil: tipo de documento del titular (CPF/CNPJ). */
  holderDocumentType?: 'CPF' | 'CNPJ' | '';
  /** Brasil/Colombia: documento del titular (CPF/CNPJ/Cédula/NIT). */
  holderDocumentNumber?: string;
  /** Mantenidos para retro-compatibilidad con sesiones anteriores del wizard,
      ya no se exponen en el UI (decisión 21/05). */
  routingNumber?: string;
  iban?: string;
  swift?: string;
  currency: string;
}
export type Step3Data = Record<string, BankAccountData>;

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: string;
  phone: string;
  department: string;
  country: string;
}
export type Step4Data = Record<string, Contact[]>;

export interface UploadedDocument {
  fileName: string;
  size: number;
  uploadedAt: Date;
}
/**
 * Documentos cargados de la entidad legal en el Paso 5.
 * `single` cubre los campos de un único archivo (la mayoría).
 * `multi` se mantiene para futura extensión (por ej. dispositivos UBO en fases posteriores).
 *
 * Decisión MVP: un único set de documentos por cuenta (no por país de operación).
 */
export interface EntityDocuments {
  single: Record<string, UploadedDocument | null>;
  multi: Record<string, UploadedDocument[]>;
}
export type Step5Data = EntityDocuments;

// Alias mantenido para evitar breaks en imports antiguos. Será removido cuando
// se cierre el barrido completo del wizard (Corrida 8+).
export type CountryDocuments = EntityDocuments;

interface OnboardingState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  step1Data: Step1Data | null;
  step2Data: Step2Data | null;
  step3Data: Step3Data | null;
  step4Data: Step4Data | null;
  step5Data: Step5Data | null;
  confirmed: boolean;
  countriesSelected: string[];
  activeCountry: string | null;
  submitting: boolean;

  setStep1Data: (data: Step1Data) => void;
  setStep2Data: (data: Step2Data) => void;
  setStep3Data: (data: Step3Data) => void;
  setStep4Data: (data: Step4Data) => void;
  setStep5Data: (data: Step5Data) => void;
  goToStep: (step: 1 | 2 | 3 | 4 | 5 | 6) => void;
  setActiveCountry: (c: string) => void;
  setConfirmed: (v: boolean) => void;
  submitOnboarding: () => Promise<void>;
  resetWizard: () => void;
}

function pickInitialActiveCountry(countries: string[], currentActive: string | null): string | null {
  if (currentActive && countries.includes(currentActive)) return currentActive;
  return countries[0] ?? null;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 1,
  step1Data: null,
  step2Data: null,
  step3Data: null,
  step4Data: null,
  step5Data: null,
  confirmed: false,
  countriesSelected: [],
  activeCountry: null,
  submitting: false,

  setStep1Data: (data) => {
    const state = get();
    set({
      step1Data: data,
      countriesSelected: data.operationCountries,
      activeCountry: pickInitialActiveCountry(data.operationCountries, state.activeCountry),
    });
  },
  setStep2Data: (data) => set({ step2Data: data }),
  setStep3Data: (data) => set({ step3Data: data }),
  setStep4Data: (data) => set({ step4Data: data }),
  setStep5Data: (data) => set({ step5Data: data }),

  goToStep: (step) => set({ currentStep: step }),
  setActiveCountry: (c) => set({ activeCountry: c }),
  setConfirmed: (v) => set({ confirmed: v }),

  submitOnboarding: async () => {
    set({ submitting: true });
    await new Promise(r => setTimeout(r, 1500));
    useAuthStore.getState().updateUser({
      onboardingStatus: 'pending_review',
      currentOnboardingStep: 6,
    });
    set({ submitting: false });
  },

  resetWizard: () =>
    set({
      currentStep: 1,
      step1Data: null,
      step2Data: null,
      step3Data: null,
      step4Data: null,
      step5Data: null,
      confirmed: false,
      countriesSelected: [],
      activeCountry: null,
      submitting: false,
    }),
}));
