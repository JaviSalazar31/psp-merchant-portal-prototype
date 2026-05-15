import { useRef, useState } from 'react';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { colors } from '@/theme/tokens';
import { toast } from '@/stores/toastStore';

export type UploadState = 'empty' | 'uploading' | 'uploaded' | 'error';

interface DocumentUploadCardProps {
  label: string;
  required?: boolean;
  /** Cantidad máxima de archivos para uploads múltiples. Default 1. */
  maxFiles?: number;
  /** Tamaño máximo en MB. Default 10. */
  maxSizeMB?: number;
  /** Formatos aceptados (extensiones sin punto). Default ['pdf']. */
  acceptedFormats?: string[];
  /** Sufijo descriptivo bajo el label (ej. "máx. 3 meses"). */
  hint?: string;
  files: { fileName: string; size: number }[];
  onChange: (files: { fileName: string; size: number }[]) => void;
}

export function DocumentUploadCard({
  label,
  required,
  maxFiles = 1,
  maxSizeMB = 10,
  acceptedFormats = ['pdf'],
  hint,
  files,
  onChange,
}: DocumentUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>(files.length > 0 ? 'uploaded' : 'empty');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const list = Array.from(incoming);

    const tooBig = list.find(f => f.size / (1024 * 1024) > maxSizeMB);
    if (tooBig) {
      setState('error');
      setErrorMsg(`"${tooBig.name}" excede ${maxSizeMB} MB.`);
      return;
    }
    const wrongFormat = list.find(f => {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
      return !acceptedFormats.includes(ext);
    });
    if (wrongFormat) {
      setState('error');
      setErrorMsg(`Formato no soportado en "${wrongFormat.name}" (se acepta: ${acceptedFormats.join(', ').toUpperCase()})`);
      return;
    }

    setState('uploading');
    setErrorMsg(null);
    // Simulamos el upload con un pequeño delay.
    setTimeout(() => {
      const newFiles = list.slice(0, maxFiles).map(f => ({ fileName: f.name, size: f.size }));
      const combined = maxFiles > 1 ? [...files, ...newFiles].slice(0, maxFiles) : newFiles;
      onChange(combined);
      setState('uploaded');
    }, 320);
  };

  const handleRemove = (index?: number) => {
    if (typeof index === 'number') {
      const next = files.filter((_, i) => i !== index);
      onChange(next);
      if (next.length === 0) setState('empty');
    } else {
      onChange([]);
      setState('empty');
    }
    toast.info('Archivo eliminado.');
  };

  const fileCountLabel = `${files.length}${maxFiles > 1 ? `/${maxFiles}` : ''}`;
  const isMulti = maxFiles > 1;

  const borderColor =
    state === 'uploaded' ? colors.pwReqMet :
    state === 'error' ? colors.bannerError.border :
    dragOver ? colors.brandPrimary :
    colors.borderDefault;

  const dashed = state !== 'uploaded' && state !== 'error';

  return (
    <Box
      onDragOver={e => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      sx={{
        border: `${dashed ? '1.5px dashed' : '1.5px solid'} ${borderColor}`,
        borderRadius: 2,
        backgroundColor:
          state === 'uploaded'
            ? colors.bannerSuccess.bg
            : state === 'error'
            ? colors.bannerError.bg
            : dragOver
            ? 'rgba(124, 255, 69, 0.06)'
            : colors.bgSubtle,
        padding: 2,
        transition: 'all 120ms ease',
      }}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" alignItems="baseline" justifyContent="space-between">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {label}
            {required && (
              <Box component="span" sx={{ color: colors.bannerError.fg, ml: 0.25 }}>
                *
              </Box>
            )}
          </Typography>
          {isMulti && state === 'uploaded' && (
            <Typography variant="caption" color="text.secondary">
              {fileCountLabel}
            </Typography>
          )}
        </Stack>

        {state === 'empty' && (
          <Stack
            alignItems="center"
            spacing={0.5}
            onClick={openPicker}
            sx={{ cursor: 'pointer', paddingY: 1 }}
          >
            <CloudUploadOutlinedIcon sx={{ color: colors.brandPrimaryDark, fontSize: 28 }} />
            <Typography variant="body2" sx={{ color: colors.textPrimary }}>
              Arrastrá o seleccioná archivo{isMulti ? `s (máx. ${maxFiles})` : ''}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {acceptedFormats.map(f => f.toUpperCase()).join(', ')}, máx. {maxSizeMB} MB
              {hint ? ` · ${hint}` : ''}
            </Typography>
          </Stack>
        )}

        {state === 'uploading' && (
          <Stack alignItems="center" spacing={1} sx={{ paddingY: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="caption" color="text.secondary">
              Subiendo archivo…
            </Typography>
          </Stack>
        )}

        {state === 'uploaded' && files.length > 0 && (
          <Stack spacing={0.75}>
            {files.map((file, idx) => (
              <Stack
                key={`${file.fileName}-${idx}`}
                direction="row"
                alignItems="center"
                spacing={1.25}
                sx={{
                  paddingX: 1.25,
                  paddingY: 0.75,
                  backgroundColor: colors.bgCard,
                  border: `1px solid ${colors.pwReqMet}`,
                  borderRadius: 1.5,
                }}
              >
                <DescriptionOutlinedIcon sx={{ color: colors.bannerError.fg, fontSize: 22 }} />
                <Stack sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {file.fileName}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CheckCircleIcon sx={{ color: colors.pwReqMet, fontSize: 14 }} />
                    <Typography variant="caption" sx={{ color: colors.pwReqMet }}>
                      Cargado correctamente
                    </Typography>
                  </Stack>
                </Stack>
                <IconButton size="small" onClick={() => toast.info('Vista previa simulada.')}>
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleRemove(idx)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
            {isMulti && files.length < maxFiles && (
              <Box
                onClick={openPicker}
                sx={{
                  cursor: 'pointer',
                  paddingY: 0.5,
                  textAlign: 'center',
                  color: colors.textLink,
                  fontSize: 13,
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                + Agregar otro archivo
              </Box>
            )}
          </Stack>
        )}

        {state === 'error' && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <ErrorOutlineIcon sx={{ color: colors.bannerError.fg, fontSize: 22 }} />
            <Typography variant="caption" sx={{ color: colors.bannerError.fg, flex: 1 }}>
              {errorMsg}
            </Typography>
            <IconButton size="small" onClick={openPicker}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={acceptedFormats.map(f => `.${f}`).join(',')}
          multiple={isMulti}
          style={{ display: 'none' }}
          onChange={e => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </Stack>
    </Box>
  );
}

export default DocumentUploadCard;
