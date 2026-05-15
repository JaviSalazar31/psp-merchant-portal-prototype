import { useState } from 'react';
import { Button, ListItemText, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import { useUIStore } from '@/stores/uiStore';
import type { Language } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

/**
 * Selector flotante: 3 opciones de UI (Español unificado / English / Português).
 * El campo "Idioma preferido" del Registro tiene su propio set de 4 opciones para
 * preferencias de comunicación del comercio — son cosas distintas.
 *
 * La traducción real de la UI con i18next queda fuera del scope del prototipo MVP;
 * por eso al elegir English/Português mostramos un toast "coming soon" en vez de
 * cambiar textos.
 */
const OPTIONS: { code: Language; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
];

const SHORT_LABEL: Record<Language, string> = {
  es: 'Español',
  en: 'English',
  'pt-BR': 'Português',
};

const COMING_SOON_TOAST: Partial<Record<Language, string>> = {
  en: 'English version coming soon',
  'pt-BR': 'Versão em português em breve',
};

interface LanguageSelectorProps {
  variant?: 'light' | 'dark';
}

export function LanguageSelector({ variant = 'light' }: LanguageSelectorProps) {
  const language = useUIStore(s => s.language);
  const setLanguage = useUIStore(s => s.setLanguage);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const color = variant === 'dark' ? colors.textInverse : colors.textPrimary;

  return (
    <>
      <Button
        startIcon={<LanguageIcon sx={{ fontSize: 18 }} />}
        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
        onClick={e => setAnchorEl(e.currentTarget)}
        sx={{
          color,
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 'auto',
          paddingX: 1,
          paddingY: 0.5,
          '&:hover': { backgroundColor: variant === 'dark' ? 'rgba(255,255,255,0.08)' : colors.bgSubtle },
        }}
      >
        {SHORT_LABEL[language]}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220, borderRadius: 1.5 } } }}
      >
        {OPTIONS.map(opt => {
          const isCurrent = opt.code === language;
          return (
            <MenuItem
              key={opt.code}
              selected={isCurrent}
              onClick={() => {
                setLanguage(opt.code);
                const comingSoon = COMING_SOON_TOAST[opt.code];
                if (comingSoon) toast.info(comingSoon);
                setAnchorEl(null);
              }}
            >
              <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: 14 }} />
              {isCurrent && <CheckIcon sx={{ fontSize: 18, color: colors.brandPrimary, ml: 1 }} />}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

export default LanguageSelector;
