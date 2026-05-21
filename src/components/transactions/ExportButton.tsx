import { Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { toast } from '@/stores/toastStore';

/**
 * Botón de exportación simplificado para Fase 1: única opción CSV.
 * Decisión 21/05 con Producto — reducir opciones para no exponer features
 * que requieren backend específico (Excel multi-hoja, PDF con layout,
 * scheduling). Esto se reabre en fases posteriores.
 */
function simulateDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv' });
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
    simulateDownload(filename, `Export simulado de ${scope} (CSV)`);
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
