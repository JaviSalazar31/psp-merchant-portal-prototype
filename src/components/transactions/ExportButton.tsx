import { useState } from 'react';
import { Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { toast } from '@/stores/toastStore';

function simulateDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButton({ scope }: { scope: string }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handle = (fmt: 'csv' | 'xlsx' | 'pdf') => {
    setAnchorEl(null);
    const ext = fmt;
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `psp-${scope}-${stamp}.${ext}`;
    simulateDownload(filename, `Export simulado de ${scope} (${fmt.toUpperCase()})`);
    toast.success(`Exportación lista — descargando ${filename}`);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FileDownloadOutlinedIcon />}
        onClick={e => setAnchorEl(e.currentTarget as HTMLElement)}
      >
        Exportar
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 240, borderRadius: 1.5 } } }}
      >
        <MenuItem onClick={() => handle('csv')}>
          <ListItemIcon><DescriptionOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Exportar a CSV" />
        </MenuItem>
        <MenuItem onClick={() => handle('xlsx')}>
          <ListItemIcon><TableViewOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Exportar a Excel (.xlsx)" />
        </MenuItem>
        <MenuItem onClick={() => handle('pdf')}>
          <ListItemIcon><PictureAsPdfOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Exportar a PDF" />
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemIcon><EventOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText
            primary="Programar exportación"
            secondary="Próximamente"
            primaryTypographyProps={{ fontSize: 14 }}
            secondaryTypographyProps={{ fontSize: 11 }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}

export default ExportButton;
