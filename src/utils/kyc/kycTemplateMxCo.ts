/**
 * Template KYC para México y Colombia.
 * Mantiene la estructura del formulario PayCash KYC Form pero con branding PSP
 * y año dinámico en el header de cada página.
 */
import {
  AlignmentType,
  Document,
  Footer,
  Header,
  PageNumber,
  Paragraph,
  TextRun,
} from 'docx';
import {
  KYC_FONT,
  KYC_PAGE_MARGIN,
  KYC_PAGE_SIZE,
  blank,
  countriesCheckboxTable,
  docTitle,
  emptyTable,
  field,
  fieldPair,
  headerLine,
  intro,
  sectionHeader,
  subTitle,
} from './kycStyles';

type MxCoCountry = 'MX' | 'CO';

const COUNTRY_LABEL: Record<MxCoCountry, string> = {
  MX: 'México',
  CO: 'Colombia',
};

const COUNTRIES_OPERATION = [
  'Argentina',
  'Brasil',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Ecuador',
  'El Salvador',
  'Guatemala',
  'Honduras',
  'México',
  'Nicaragua',
  'Panamá',
  'Perú',
  'República Dominicana',
];

/**
 * Construye el documento KYC para México o Colombia con el año dinámico recibido.
 */
export function buildMxCoDoc(country: MxCoCountry, year: number): Document {
  const countryLabel = COUNTRY_LABEL[country];

  return new Document({
    creator: 'PSP Merchant Portal',
    title: `PSP KYC Form - ${countryLabel} ${year}`,
    description: 'Formulario de Conocimiento del Cliente PSP',
    styles: {
      default: {
        document: { run: { font: KYC_FONT, size: 22 } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: KYC_PAGE_SIZE,
            margin: KYC_PAGE_MARGIN,
          },
        },
        headers: {
          default: new Header({
            children: [headerLine(countryLabel, year)],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Información reservada — uso exclusivo del PSP   |   Página ',
                    size: 16,
                    color: '888888',
                    italics: true,
                    font: KYC_FONT,
                  }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '888888', font: KYC_FONT }),
                  new TextRun({ text: ' de ', size: 16, color: '888888', font: KYC_FONT }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '888888', font: KYC_FONT }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ===== Título =====
          docTitle('Formulario de Conocimiento del Cliente'),
          intro('Por favor ingresá la información de tu negocio registrado para permitirnos la identificación.'),

          // ===== Página 1: Información de la empresa =====
          sectionHeader('Información de la empresa'),
          field('Denominación social / Nombre legal'),
          field('Nombre comercial'),
          field('No. de escritura pública / Póliza / Certificado'),
          field('Fecha de incorporación / Constitución'),
          field('Datos de Registro Público / Cámara de Comercio / Folio Mercantil'),
          field('País de origen / Lugar de constitución'),
          field('Giro u objeto del negocio'),
          field('Número de Identificación Tributaria'),
          field('Segmento'),
          field('Licencia'),

          // ===== Domicilio de la empresa =====
          sectionHeader('Domicilio de la empresa'),
          field('Calle'),
          field('Ciudad'),
          field('Estado / Provincia / Región'),
          field('Código Postal'),
          field('País'),

          // Salto de página manual para mantener layout consistente con el PDF original
          new Paragraph({ children: [new TextRun({ text: '', break: 1 })], pageBreakBefore: true }),

          // ===== Página 2: Países en Operación + Operación + Accionistas =====
          sectionHeader('Países en Operación'),
          countriesCheckboxTable(COUNTRIES_OPERATION),

          blank(80),

          new Paragraph({
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({ text: '¿Administra los fondos de su cliente?', size: 22, font: KYC_FONT }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 200 },
            children: [
              new TextRun({ text: '\u2610  Sí          \u2610  No', size: 22, font: KYC_FONT }),
            ],
          }),

          field('Página web de la empresa'),
          field('E-mail de la empresa'),

          sectionHeader('Accionistas / Último Beneficiario'),
          emptyTable(['Nombre de persona física o moral', 'Porcentaje de acciones'], 6),

          new Paragraph({ children: [new TextRun({ text: '', break: 1 })], pageBreakBefore: true }),

          // ===== Página 3: Sistema de Administración + Director General + General Manager =====
          sectionHeader('Sistema de Administración de la empresa'),
          subTitle('Director General'),
          fieldPair('Nombre', 'Apellido'),
          fieldPair('Fecha de nacimiento', 'Dirección de e-mail'),
          fieldPair('Tipo de identificación', 'Número de identificación'),
          subTitle('Dirección', AlignmentType.LEFT),
          fieldPair('Calle', 'Ciudad'),
          fieldPair('Estado', 'Código Postal'),
          field('País'),

          blank(120),

          subTitle('General Manager'),
          fieldPair('Nombre', 'Apellido'),
          fieldPair('Fecha de nacimiento', 'E-mail'),
          fieldPair('Tipo de identificación', 'Número de identificación'),
          subTitle('Dirección', AlignmentType.LEFT),
          fieldPair('Calle', 'Ciudad'),
          fieldPair('Estado', 'Código Postal'),
          field('País'),

          new Paragraph({ children: [new TextRun({ text: '', break: 1 })], pageBreakBefore: true }),

          // ===== Página 4: Representante Legal + Detalles persona + Firmas =====
          subTitle('Representante Legal'),
          fieldPair('Nombre', 'Apellido'),
          fieldPair('Fecha de nacimiento', 'E-mail'),
          fieldPair('Tipo de identificación', 'Número de identificación'),
          subTitle('Dirección', AlignmentType.LEFT),
          fieldPair('Calle', 'Ciudad'),
          fieldPair('Estado', 'Código Postal'),
          field('País'),

          blank(160),

          sectionHeader('Detalles de la persona que llenó el formulario'),
          fieldPair('Nombre', 'Apellido'),
          fieldPair('Puesto', 'E-mail'),

          blank(200),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 60 },
            children: [new TextRun({ text: '_______________________________', size: 22, font: KYC_FONT })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [new TextRun({ text: 'Firma', size: 20, font: KYC_FONT })],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 60 },
            children: [new TextRun({ text: '_______________________________', size: 22, font: KYC_FONT })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: 'Nombre del Representante Legal', size: 20, font: KYC_FONT })],
          }),
        ],
      },
    ],
  });
}
