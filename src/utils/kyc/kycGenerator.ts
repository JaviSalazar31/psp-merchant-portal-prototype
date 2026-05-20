/**
 * Generador principal de KYC. Despacha al template correcto según el país
 * y devuelve un Blob listo para descargar como .docx.
 *
 * El año se calcula dinámicamente al momento de generación (new Date().getFullYear()),
 * por lo que el header siempre refleja el año vigente.
 */
import { Packer } from 'docx';
import { buildMxCoDoc } from './kycTemplateMxCo';
import { buildBrDoc } from './kycTemplateBr';

export type KycCountry = 'MX' | 'CO' | 'BR';

/**
 * Genera el documento KYC en formato .docx para el país indicado.
 * @returns Blob listo para descargar.
 */
export async function generateKycDocx(country: KycCountry): Promise<Blob> {
  const year = new Date().getFullYear();
  const doc =
    country === 'BR'
      ? buildBrDoc(year)
      : buildMxCoDoc(country, year);

  return Packer.toBlob(doc);
}

/**
 * Nombre de archivo sugerido para la descarga.
 */
export function kycDocxFilename(country: KycCountry): string {
  const year = new Date().getFullYear();
  return `psp-kyc-${country.toLowerCase()}-${year}.docx`;
}
