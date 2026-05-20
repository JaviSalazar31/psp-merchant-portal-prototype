/**
 * Estilos y helpers compartidos para los templates KYC del Wizard de Onboarding.
 * Genera documentos Word con branding PSP, layout consistente y año dinámico.
 */
import {
  AlignmentType,
  BorderStyle,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TabStopType,
  TextRun,
  WidthType,
} from 'docx';

// ===== Tokens de marca PSP =====
export const KYC_FONT = 'Arial';
export const KYC_BRAND_TEXT = 'PSP';

// Page size A4 en DXA (estándar LATAM, consistente con formularios regulatorios locales).
export const KYC_PAGE_SIZE = {
  width: 11906,
  height: 16838,
};

// Márgenes 1 inch = 1440 DXA
export const KYC_PAGE_MARGIN = {
  top: 1440,
  right: 1440,
  bottom: 1440,
  left: 1440,
};

// Content width = page width - left - right
export const KYC_CONTENT_WIDTH = 9026;

// ===== Helpers para encabezado / pie =====

/**
 * Genera el header de cada página: "PSP" a la izquierda, "KYC Form · {país} — {año}" a la derecha.
 * Usa tab stops (no tablas) según recomendación de la skill docx.
 */
export function headerLine(countryLabel: string, year: number): Paragraph {
  return new Paragraph({
    tabStops: [
      { type: TabStopType.RIGHT, position: KYC_CONTENT_WIDTH },
    ],
    spacing: { after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '6BAA2E', space: 4 },
    },
    children: [
      new TextRun({ text: KYC_BRAND_TEXT, bold: true, size: 28, font: KYC_FONT, color: '2A6F1F' }),
      new TextRun({ text: '\t' }),
      new TextRun({
        text: `KYC Form · ${countryLabel} — ${year}`,
        size: 18,
        color: '888888',
        font: KYC_FONT,
      }),
    ],
  });
}

/**
 * Pie de página con texto de confidencialidad + número de página.
 */
export function footerLine(confidentialityText: string): Paragraph {
  return new Paragraph({
    tabStops: [
      { type: TabStopType.RIGHT, position: KYC_CONTENT_WIDTH },
    ],
    children: [
      new TextRun({ text: confidentialityText, size: 16, color: '888888', italics: true, font: KYC_FONT }),
    ],
  });
}

// ===== Helpers de contenido =====

/**
 * Título principal del documento (centrado, grande, bold).
 */
export function docTitle(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240 },
    children: [new TextRun({ text, bold: true, size: 32, font: KYC_FONT })],
  });
}

/**
 * Párrafo introductorio.
 */
export function intro(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text, size: 22, font: KYC_FONT })],
  });
}

/**
 * Encabezado de sección (bold, centrado, tamaño intermedio, negro).
 */
export function sectionHeader(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 280, after: 180 },
    children: [new TextRun({ text, bold: true, size: 26, font: KYC_FONT, color: '000000' })],
  });
}

/**
 * Subtítulo (bold, centrado o izquierda).
 */
export function subTitle(
  text: string,
  alignment: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.CENTER,
): Paragraph {
  return new Paragraph({
    alignment,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, font: KYC_FONT })],
  });
}

/**
 * Campo de formulario: label arriba, línea horizontal para que el comercio llene a mano.
 * Se usa para campos de una sola línea.
 */
export function field(label: string, opts?: { spaceAfter?: number }): Paragraph {
  return new Paragraph({
    spacing: { before: 120, after: opts?.spaceAfter ?? 40 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '888888', space: 6 },
    },
    children: [new TextRun({ text: label, size: 20, font: KYC_FONT })],
  });
}

/**
 * Campo de formulario con espacio extra para llenar (multilinea).
 */
export function fieldTall(label: string): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 120, after: 0 },
      children: [new TextRun({ text: label, size: 20, font: KYC_FONT })],
    }),
    new Paragraph({
      spacing: { before: 60, after: 40 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: '888888', space: 6 },
      },
      children: [new TextRun({ text: ' ', size: 20, font: KYC_FONT })],
    }),
  ];
}

/**
 * Dos campos lado a lado, separados por tab. Usa tab stop centrado.
 * Útil para "Nombre / Apellido", "Calle / Ciudad", etc.
 */
export function fieldPair(labelLeft: string, labelRight: string): Paragraph {
  const halfWidth = Math.floor(KYC_CONTENT_WIDTH / 2);
  return new Paragraph({
    tabStops: [{ type: TabStopType.LEFT, position: halfWidth }],
    spacing: { before: 120, after: 40 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '888888', space: 6 },
    },
    children: [
      new TextRun({ text: labelLeft, size: 20, font: KYC_FONT }),
      new TextRun({ text: '\t' }),
      new TextRun({ text: labelRight, size: 20, font: KYC_FONT }),
    ],
  });
}

/**
 * Tres campos lado a lado.
 */
export function fieldTriple(labelLeft: string, labelMid: string, labelRight: string): Paragraph {
  const third = Math.floor(KYC_CONTENT_WIDTH / 3);
  return new Paragraph({
    tabStops: [
      { type: TabStopType.LEFT, position: third },
      { type: TabStopType.LEFT, position: third * 2 },
    ],
    spacing: { before: 120, after: 40 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '888888', space: 6 },
    },
    children: [
      new TextRun({ text: labelLeft, size: 20, font: KYC_FONT }),
      new TextRun({ text: '\t' }),
      new TextRun({ text: labelMid, size: 20, font: KYC_FONT }),
      new TextRun({ text: '\t' }),
      new TextRun({ text: labelRight, size: 20, font: KYC_FONT }),
    ],
  });
}

/**
 * Tabla para "Países en Operación" con checkboxes.
 * Renderiza una tabla 2 columnas con un checkbox vacío (□) + nombre de país en cada celda.
 */
export function countriesCheckboxTable(countries: string[]): Table {
  const borderStyle = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
  const cellBorders = {
    top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle,
  };
  const colWidth = Math.floor(KYC_CONTENT_WIDTH / 2);

  // Distribuir países en 2 columnas. Si es impar, la última fila tiene celda vacía a la derecha.
  const rows: TableRow[] = [];
  for (let i = 0; i < countries.length; i += 2) {
    const left = countries[i];
    const right = countries[i + 1] ?? '';
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders,
            width: { size: colWidth, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: `\u2610  ${left}`, size: 20, font: KYC_FONT })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorders,
            width: { size: colWidth, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: right ? `\u2610  ${right}` : '', size: 20, font: KYC_FONT })],
              }),
            ],
          }),
        ],
      }),
    );
  }

  return new Table({
    width: { size: KYC_CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [colWidth, colWidth],
    rows,
  });
}

/**
 * Tabla genérica para UBO/accionistas con N filas vacías para llenar.
 */
export function emptyTable(headers: string[], rows: number): Table {
  const borderStyle = { style: BorderStyle.SINGLE, size: 4, color: '888888' };
  const cellBorders = {
    top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle,
  };
  const colCount = headers.length;
  const colWidth = Math.floor(KYC_CONTENT_WIDTH / colCount);
  const columnWidths = Array(colCount).fill(colWidth);
  // Ajuste para que la suma cuadre exactamente
  columnWidths[0] += KYC_CONTENT_WIDTH - colWidth * colCount;

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      borders: cellBorders,
      width: { size: columnWidths[i], type: WidthType.DXA },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      shading: { fill: 'F0F0F0', type: ShadingType.CLEAR },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: h, bold: true, size: 20, font: KYC_FONT })],
      })],
    })),
  });

  const dataRows = Array.from({ length: rows }, () =>
    new TableRow({
      children: headers.map((_, i) => new TableCell({
        borders: cellBorders,
        width: { size: columnWidths[i], type: WidthType.DXA },
        margins: { top: 160, bottom: 160, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: ' ', size: 20, font: KYC_FONT })] })],
      })),
    }),
  );

  return new Table({
    width: { size: KYC_CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths,
    rows: [headerRow, ...dataRows],
  });
}

/**
 * Línea vacía con altura controlada.
 */
export function blank(size: number = 60): Paragraph {
  return new Paragraph({
    spacing: { before: size, after: size },
    children: [new TextRun({ text: ' ', size: 20, font: KYC_FONT })],
  });
}

/**
 * Item de checklist (para "Documentos anexos").
 */
export function checklistItem(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
    children: [new TextRun({ text: `\u2610  ${text}`, size: 20, font: KYC_FONT })],
  });
}

/**
 * Texto legal (pequeño, justificado).
 */
export function legalText(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text, size: 18, font: KYC_FONT })],
  });
}

/**
 * Footnote regulatorio (más chico aún, italics).
 */
export function footnote(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, size: 16, color: '666666', italics: true, font: KYC_FONT })],
  });
}
