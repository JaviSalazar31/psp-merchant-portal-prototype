import { Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { toast } from '@/stores/toastStore';

/**
 * Botón "Exportar a CSV" — único formato disponible (no PDF, no Excel).
 *
 * Acordado: la exportación general de listados (Transacciones, Settlements)
 * solo soporta CSV. Los formatos PDF/Excel quedaron descartados para esta
 * versión. No hay menú desplegable: el botón ejecuta directo el download.
 *
 * En esta maqueta la descarga es simulada (un .csv con un placeholder de
 * scope). En el integrado real, esta función arma el CSV con los filtros
 * actuales aplicados a la grilla.
 */

function simulateCsvDownload(filename: string, content: string): void {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButton({ scope }: { scope: string }) {
  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `psp-${scope}-${stamp}.csv`;
    simulateCsvDownload(filename, `Export simulado de ${scope}`);
    toast.success(`Exportación lista — descargando ${filename}`);
  };

  return (
    <Button
      variant="outlined"
      startIcon={<FileDownloadOutlinedIcon />}
      onClick={handleExport}
    >
      Exportar a CSV
    </Button>
  );
}

export default ExportButton;
