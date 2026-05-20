import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { WizardFooter } from './OnboardingLayout';
import CountryPills from '@/components/common/CountryPills';
import ContextBanner from '@/components/common/ContextBanner';
import CrearContactoModal from './CrearContactoModal';
import { COUNTRY_BY_CODE } from '@/constants/countries';
import { DEPARTMENTS } from '@/constants/industries';
import { useOnboardingStore, type Contact, type Step4Data } from '@/stores/onboardingStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

function getDepartmentMeta(key: string) {
  return DEPARTMENTS.find(d => d.key === key) ?? DEPARTMENTS[0];
}

function initials(c: Contact): string {
  return `${c.firstName[0] ?? '?'}${c.lastName[0] ?? ''}`.toUpperCase();
}

export function Step4Contactos() {
  const navigate = useNavigate();
  const countries = useOnboardingStore(s => s.countriesSelected);
  const activeCountry = useOnboardingStore(s => s.activeCountry);
  const setActiveCountry = useOnboardingStore(s => s.setActiveCountry);
  const existing = useOnboardingStore(s => s.step4Data);
  const setStep4Data = useOnboardingStore(s => s.setStep4Data);

  const [byCountry, setByCountry] = useState<Step4Data>(() => {
    const init: Step4Data = {};
    for (const c of countries) init[c] = existing?.[c] ?? [];
    return init;
  });

  const [modal, setModal] = useState<{ open: boolean; editing?: Contact | null }>({
    open: false,
    editing: null,
  });

  useEffect(() => {
    if (countries.length === 0) navigate('/onboarding/step-1');
  }, [countries, navigate]);

  const current = activeCountry ?? countries[0];
  const contacts = useMemo(() => (current ? byCountry[current] ?? [] : []), [byCountry, current]);

  const missingCountries = countries.filter(c => (byCountry[c]?.length ?? 0) === 0);
  const allComplete = countries.length > 0 && missingCountries.length === 0;

  const onSave = (contact: Contact) => {
    if (!current) return;
    setByCountry(prev => {
      const list = prev[current] ?? [];
      const found = list.find(c => c.id === contact.id);
      const newList = found
        ? list.map(c => (c.id === contact.id ? contact : c))
        : [...list, contact];
      return { ...prev, [current]: newList };
    });
    toast.success(modal.editing ? 'Contacto actualizado.' : 'Contacto creado.');
  };

  const onContinue = () => {
    if (!countries.every(c => (byCountry[c]?.length ?? 0) > 0)) {
      toast.error('Agregá al menos un contacto para cada país seleccionado.');
      const firstMissing = countries.find(c => (byCountry[c]?.length ?? 0) === 0);
      if (firstMissing) setActiveCountry(firstMissing);
      return;
    }
    setStep4Data(byCountry);
    navigate('/onboarding/step-5');
  };

  if (!current) return null;

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Contactos y Escalaciones</Typography>
        <Typography variant="body2" color="text.secondary">
          Definí los puntos de contacto clave para las áreas relevantes de tu negocio.
        </Typography>
      </Stack>

      {countries.length > 1 && (
        <CountryPills countries={countries} active={current} onChange={setActiveCountry} />
      )}

      {countries.length > 1 && missingCountries.length > 0 && (
        <ContextBanner variant="warning">
          Te falta agregar contactos de:{' '}
          {missingCountries.map(c => COUNTRY_BY_CODE[c]?.name ?? c).join(', ')}.
        </ContextBanner>
      )}

      <Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setModal({ open: true, editing: null })}
        >
          Crear Contacto
        </Button>
      </Box>

      <ContextBanner variant="info">
        Los contactos deben ser personas que desempeñen un papel importante en sus respectivas áreas y
        puedan proporcionar la información o asistencia necesaria.
      </ContextBanner>

      {contacts.length === 0 ? (
        <Box
          sx={{
            border: `1px dashed ${colors.borderDefault}`,
            borderRadius: 2,
            padding: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Todavía no agregaste contactos para este país. Apretá &quot;Crear Contacto&quot; para empezar.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          sx={{
            border: `1px solid ${colors.borderDefault}`,
            borderRadius: 2,
            overflow: 'auto',
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.bgSubtle }}>
                <TableCell sx={{ fontSize: 11, letterSpacing: 1, color: colors.textSecondary }}>
                  NOMBRE
                </TableCell>
                <TableCell sx={{ fontSize: 11, letterSpacing: 1, color: colors.textSecondary }}>
                  APELLIDO
                </TableCell>
                <TableCell sx={{ fontSize: 11, letterSpacing: 1, color: colors.textSecondary }}>
                  CORREO ELECTRÓNICO
                </TableCell>
                <TableCell sx={{ fontSize: 11, letterSpacing: 1, color: colors.textSecondary }}>
                  TELÉFONO
                </TableCell>
                <TableCell sx={{ fontSize: 11, letterSpacing: 1, color: colors.textSecondary }}>
                  DEPARTAMENTO
                </TableCell>
                <TableCell align="right" sx={{ fontSize: 11, letterSpacing: 1, color: colors.textSecondary }}>
                  ACCIONES
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map(c => {
                const dept = getDepartmentMeta(c.department);
                return (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor: colors.brandPrimary,
                            color: colors.brandDarkest,
                          }}
                        >
                          {initials(c)}
                        </Avatar>
                        <span>{c.firstName}</span>
                      </Stack>
                    </TableCell>
                    <TableCell>{c.lastName}</TableCell>
                    <TableCell sx={{ color: colors.textLink }}>{c.email}</TableCell>
                    <TableCell>
                      {c.phonePrefix} {c.phone}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={dept.label}
                        size="small"
                        sx={{ backgroundColor: dept.color.bg, color: dept.color.fg, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setModal({ open: true, editing: c })}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CrearContactoModal
        open={modal.open}
        country={current}
        existing={modal.editing}
        onClose={() => setModal({ open: false, editing: null })}
        onSave={onSave}
      />

      <WizardFooter
        onBack={() => navigate('/onboarding/step-3')}
        onContinue={onContinue}
        continueDisabled={!allComplete}
      />
    </Stack>
  );
}

export default Step4Contactos;
