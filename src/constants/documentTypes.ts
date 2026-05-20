/**
 * Documentos requeridos en el Paso 5 del Wizard de Onboarding.
 *
 * Decisión MVP (Fase 1): los documentos corresponden a la entidad legal,
 * no al país de operación. El comercio sube un único set de documentos
 * correspondientes a su país de constitución (definido en Step 1).
 * Casos con filiales legales en múltiples países se manejan vía cuentas
 * independientes (fuera de alcance MVP).
 */

export type IncorporationCountry = 'MX' | 'CO' | 'BR';

export interface DocumentDef {
  key: string;
  /** Etiqueta del campo. Puede ser dinámica según el país de constitución. */
  label: string | ((incorporation: IncorporationCountry) => string);
  required: boolean;
  section: 'kyc' | 'entity';
  maxFiles?: number;
  /** Extensiones aceptadas (sin punto). Default ['pdf']. */
  acceptedFormats?: string[];
  /**
   * Si está seteado, el documento aparece solo cuando el país de constitución coincide.
   * Usado para el Poder Legal (exclusivo de México).
   */
  visibleOnlyForIncorporation?: IncorporationCountry;
  /** Texto auxiliar bajo la etiqueta. */
  hint?: string;
}

export const ONBOARDING_DOCUMENTS: DocumentDef[] = [
  // === KYC firmado (generado por el botón "Descargar plantilla KYC") ===
  { key: 'kyc_signed', label: 'KYC firmado', required: true, section: 'kyc' },

  // === Documentos de la entidad legal ===
  {
    key: 'acta_constitutiva',
    label: 'Acta Constitutiva',
    required: true,
    section: 'entity',
  },
  {
    key: 'poder_legal',
    label: 'Poder Legal',
    required: true,
    section: 'entity',
    visibleOnlyForIncorporation: 'MX',
    hint: 'Aplica solo para entidades constituidas en México.',
  },
  {
    key: 'id_representante_legal',
    label: 'Documento de identificación del Representante Legal',
    required: true,
    section: 'entity',
    hint: 'Pasaporte, cédula o DNI.',
  },
  {
    key: 'doc_fiscal',
    label: (incorporation) => {
      if (incorporation === 'MX') return 'RFC — Constancia de Situación Fiscal';
      if (incorporation === 'CO') return 'NIT — Registro Único Tributario';
      if (incorporation === 'BR') return 'CNPJ — Cartão CNPJ';
      return 'Documento Fiscal';
    },
    required: true,
    section: 'entity',
  },
  {
    key: 'comprobante_domicilio_entidad',
    label: 'Comprobante de domicilio de la entidad',
    required: true,
    section: 'entity',
    hint: 'Recibo de servicio público: agua, luz o teléfono.',
  },
  {
    key: 'certificado_cuenta_bancaria',
    label: 'Certificado de cuenta bancaria',
    required: true,
    section: 'entity',
    hint: 'Carátula de la cuenta o certificado bancario equivalente.',
  },
  {
    key: 'logotipo',
    label: 'Logotipo de la empresa',
    required: true,
    section: 'entity',
    acceptedFormats: ['svg', 'ai', 'eps', 'pdf', 'png'],
    hint: 'Preferentemente en formato vectorial (SVG, AI, EPS).',
  },
];

/**
 * Resuelve la etiqueta de un documento según el país de constitución.
 */
export function resolveDocLabel(doc: DocumentDef, incorporation: IncorporationCountry | null): string {
  if (typeof doc.label === 'string') return doc.label;
  return doc.label(incorporation ?? 'MX');
}

/**
 * Devuelve los documentos visibles para un país de constitución dado.
 * Aplica el filtro de `visibleOnlyForIncorporation`.
 */
export function visibleDocsFor(incorporation: IncorporationCountry | null): DocumentDef[] {
  return ONBOARDING_DOCUMENTS.filter(d => {
    if (!d.visibleOnlyForIncorporation) return true;
    return d.visibleOnlyForIncorporation === incorporation;
  });
}
