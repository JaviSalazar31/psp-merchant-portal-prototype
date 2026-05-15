export interface DocumentDef {
  key: string;
  label: string;
  required: boolean;
  section: 'kyc' | 'company' | 'fiscal' | 'ubo';
  maxFiles?: number;
  conditional?: 'crypto'; // visible solo si se activó liquidación en cripto
}

export const ONBOARDING_DOCUMENTS: DocumentDef[] = [
  { key: 'kyc_signed', label: 'KYC firmado', required: true, section: 'kyc' },

  { key: 'cert_constitucion', label: 'Certificado de Constitución', required: true, section: 'company' },
  { key: 'cert_vigencia', label: 'Certificado de Vigencia', required: true, section: 'company' },
  { key: 'cert_incumbencia', label: 'Certificado de Incumbencia', required: true, section: 'company' },
  { key: 'licencia_operacion', label: 'Licencia de Operación', required: true, section: 'company' },
  { key: 'registro_directores', label: 'Copia del Registro de Directores', required: true, section: 'company' },
  { key: 'registro_accionistas', label: 'Copia del Registro de Accionistas', required: true, section: 'company' },

  { key: 'comprobante_url', label: 'Comprobante de Propiedad de URL', required: true, section: 'fiscal' },
  { key: 'doc_id_fiscal', label: 'Documento de Identificación Fiscal', required: true, section: 'fiscal' },
  { key: 'comprobante_domicilio_empresa', label: 'Comprobante de Domicilio (máx. 3 meses)', required: true, section: 'fiscal' },
  { key: 'carta_cripto', label: 'Carta para Liquidación en Cripto', required: true, section: 'fiscal', conditional: 'crypto' },

  { key: 'ubo_ids', label: 'Dos identificaciones oficiales por UBO', required: true, section: 'ubo', maxFiles: 6 },
  { key: 'ubo_comprobante_domicilio', label: 'Comprobante de Domicilio (UBOs)', required: true, section: 'ubo', maxFiles: 3 },
  { key: 'ubo_direccion_directores', label: 'Dirección Residencial de Directores y Accionistas +25%', required: true, section: 'ubo', maxFiles: 3 },
];
