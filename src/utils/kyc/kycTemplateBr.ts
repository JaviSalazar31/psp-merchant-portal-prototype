/**
 * Template KYC para Brasil.
 * Portugués, branding PSP, año dinámico, incluye declaração legal,
 * checklist de documentos anexos y marco regulatório BACEN/Lei 9.613/1998.
 */
import {
  AlignmentType,
  Document,
  Footer,
  Header,
  PageNumber,
  Paragraph,
  TabStopType,
  TextRun,
} from 'docx';
import {
  KYC_FONT,
  KYC_PAGE_MARGIN,
  KYC_PAGE_SIZE,
  blank,
  checklistItem,
  countriesCheckboxTable,
  docTitle,
  emptyTable,
  field,
  fieldPair,
  fieldTriple,
  footnote,
  headerLine,
  intro,
  legalText,
  sectionHeader,
  subTitle,
} from './kycStyles';

const COUNTRIES_OPERATION_BR = [
  'Argentina',
  'Brasil',
  'Chile',
  'Colômbia',
  'Costa Rica',
  'Equador',
  'El Salvador',
  'Guatemala',
  'Honduras',
  'México',
  'Nicarágua',
  'Panamá',
  'Peru',
  'República Dominicana',
];

const DECLARACAO = (
  'Declaro, sob as penas da lei, que as informações prestadas neste formulário são verdadeiras, ' +
  'exatas e completas. Autorizo o PSP a verificar os dados fornecidos e a realizar as consultas ' +
  'necessárias em listas restritivas e bases de dados de controle de riscos em cumprimento à ' +
  'Lei 9.613/1998 (PLD/FT) e demais normas aplicáveis. Comprometo-me a comunicar tempestivamente ' +
  'qualquer alteração nos dados aqui declarados.'
);

const MARCO_REGULATORIO = (
  'Marco regulatório aplicável: Banco Central do Brasil (BACEN, Resolução BCB nº 80/2021), ' +
  'Lei 9.613/1998 — Prevenção à Lavagem de Dinheiro (PLD/FT), Receita Federal — Cartão CNPJ ' +
  'e Cadastro de Beneficiários Finais (IN 2.119/2022).'
);

const UBO_NOTE = (
  'Beneficiário Final (UBO) — conforme IN RFB nº 2.119/2022. Pessoa física com ≥ 25% de ' +
  'participação ou controle efetivo.'
);

/**
 * Construye el documento KYC para Brasil con el año dinámico recibido.
 */
export function buildBrDoc(year: number): Document {
  return new Document({
    creator: 'PSP Merchant Portal',
    title: `PSP KYC Form - Brasil ${year}`,
    description: 'Formulário de Conhecimento do Cliente PSP',
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
            children: [headerLine('Brasil', year)],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Informação reservada — uso exclusivo do PSP   |   Página ',
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
          docTitle('Formulário de Conhecimento do Cliente'),
          intro('Por favor, preencha as informações da sua empresa registrada para permitir a identificação.'),

          // ===== Página 1: Informações da empresa + Endereço =====
          sectionHeader('Informações da empresa'),
          field('Razão social'),
          field('Nome fantasia'),
          field('Número do contrato social / estatuto social'),
          fieldPair('Data de constituição (DD/MM/AAAA)', 'NIRE (Junta Comercial)'),
          fieldPair('País de constituição', 'Objeto social / atividade principal — Código CNAE'),
          fieldPair('CNPJ (Receita Federal)', 'Segmento de mercado'),
          field('Licença ou autorização regulatória — BACEN, ANBIMA ou outra se aplicável'),

          sectionHeader('Endereço da empresa'),
          field('Logradouro (rua, avenida) + número'),
          fieldPair('Município', 'Estado (UF)'),
          fieldPair('CEP', 'País'),

          new Paragraph({ children: [new TextRun({ text: '', break: 1 })], pageBreakBefore: true }),

          // ===== Página 2: Países + Operação + UBO =====
          sectionHeader('Países em Operação'),
          countriesCheckboxTable(COUNTRIES_OPERATION_BR),

          blank(120),

          sectionHeader('Operação e dados de contato'),
          new Paragraph({
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({
                text: 'Administra recursos de terceiros?  ',
                size: 22,
                font: KYC_FONT,
              }),
              new TextRun({
                text: '(Relevante para PLD/FT — Lei 9.613/1998)',
                size: 18,
                italics: true,
                color: '666666',
                font: KYC_FONT,
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 200 },
            children: [
              new TextRun({ text: '\u2610  Sim          \u2610  Não', size: 22, font: KYC_FONT }),
            ],
          }),

          fieldPair('Site corporativo', 'E-mail corporativo'),

          sectionHeader('Beneficiários Finais'),
          legalText(UBO_NOTE),
          emptyTable(['Nome completo', 'Tipo e nº de identificação', '% Participação'], 5),

          new Paragraph({ children: [new TextRun({ text: '', break: 1 })], pageBreakBefore: true }),

          // ===== Página 3: Sistema de Administração =====
          sectionHeader('Sistema de Administração da empresa'),

          subTitle('Diretor Presidente / CEO'),
          field('Nome completo'),
          fieldPair('Data de nascimento (DD/MM/AAAA)', 'E-mail'),
          fieldPair('Tipo de identificação — RG / CPF / CNH', 'Número de identificação'),
          field('Endereço residencial'),
          fieldTriple('Município', 'Estado (UF)', 'País'),

          blank(120),

          subTitle('Diretor Geral / Gerente Geral'),
          field('Nome completo'),
          fieldPair('Data de nascimento (DD/MM/AAAA)', 'E-mail'),
          fieldPair('Tipo de identificação — RG / CPF / CNH', 'Número de identificação'),
          field('Endereço residencial'),
          fieldTriple('Município', 'Estado (UF)', 'País'),

          blank(120),

          subTitle('Representante Legal / Sócio Administrador'),
          field('Nome completo'),
          fieldPair('Data de nascimento (DD/MM/AAAA)', 'E-mail'),
          fieldPair('Tipo de identificação — RG / CPF / CNH', 'Número de identificação'),
          field('Endereço residencial'),
          fieldTriple('Município', 'Estado (UF)', 'País'),

          new Paragraph({ children: [new TextRun({ text: '', break: 1 })], pageBreakBefore: true }),

          // ===== Página 4: Quem preencheu + Declaração + Documentos anexos =====
          sectionHeader('Dados de quem preencheu o formulário'),
          field('Nome completo'),
          fieldPair('Cargo na empresa', 'E-mail'),

          subTitle('Declaração'),
          legalText(DECLARACAO),

          blank(120),

          new Paragraph({
            spacing: { before: 400, after: 60 },
            tabStops: [{ type: TabStopType.LEFT, position: 4800 }],
            children: [
              new TextRun({ text: '________________________________', size: 22, font: KYC_FONT }),
              new TextRun({ text: '\t' }),
              new TextRun({ text: '________________________________', size: 22, font: KYC_FONT }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            tabStops: [{ type: TabStopType.LEFT, position: 4800 }],
            children: [
              new TextRun({ text: 'Assinatura de quem preencheu', size: 18, font: KYC_FONT }),
              new TextRun({ text: '\t' }),
              new TextRun({ text: 'Assinatura do Representante Legal', size: 18, font: KYC_FONT }),
            ],
          }),

          blank(120),

          new Paragraph({
            spacing: { before: 200, after: 60 },
            tabStops: [{ type: TabStopType.LEFT, position: 4800 }],
            children: [
              new TextRun({ text: '________________________________', size: 22, font: KYC_FONT }),
              new TextRun({ text: '\t' }),
              new TextRun({ text: '________________________________', size: 22, font: KYC_FONT }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            tabStops: [{ type: TabStopType.LEFT, position: 4800 }],
            children: [
              new TextRun({ text: 'Local e data', size: 18, font: KYC_FONT }),
              new TextRun({ text: '\t' }),
              new TextRun({ text: 'Nome completo em letra de forma', size: 18, font: KYC_FONT }),
            ],
          }),

          subTitle('Documentos anexos'),
          checklistItem('Contrato social ou estatuto social'),
          checklistItem('RG e CPF do Representante Legal'),
          checklistItem('Cartão CNPJ'),
          checklistItem('Comprovante de endereço (≤ 90 dias)'),
          checklistItem('Comprovante de conta bancária PJ'),
          checklistItem('Logotipo (formato vetorial)'),

          footnote(MARCO_REGULATORIO),
        ],
      },
    ],
  });
}
