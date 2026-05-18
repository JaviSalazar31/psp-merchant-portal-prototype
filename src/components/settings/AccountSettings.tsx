import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ContextBanner from '@/components/common/ContextBanner';
import EditAccountSectionModal, { type AccountSection } from './EditAccountSectionModal';
import { useAccountStore } from '@/stores/accountStore';
import { useAuthStore } from '@/stores/authStore';
import { COUNTRY_BY_CODE } from '@/constants/countries';
import { colors } from '@/theme/tokens';

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 0.25, sm: 1.5 }}
      sx={{ paddingY: 0.5 }}
    >
      <Typography
        variant="caption"
        sx={{ width: { sm: 200 }, color: colors.textSecondary, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
        {value}
      </Typography>
    </Stack>
  );
}

function SectionCard({
  title,
  description,
  onEdit,
  editLabel = 'Editar',
  editDisabled,
  children,
}: {
  title: string;
  description?: string;
  onEdit?: () => void;
  editLabel?: string;
  editDisabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Stack spacing={0.5}>
              <Typography variant="h4">{title}</Typography>
              {description && (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              )}
            </Stack>
            {onEdit && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditOutlinedIcon fontSize="small" />}
                onClick={onEdit}
                disabled={editDisabled}
              >
                {editLabel}
              </Button>
            )}
          </Stack>
          <Divider />
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function AccountSettings() {
  const account = useAccountStore(s => s.account);
  const user = useAuthStore(s => s.user);

  const [activeCountry, setActiveCountry] = useState<string>(
    account.operationCountries[0] ?? 'MX',
  );
  const [modal, setModal] = useState<{ section: AccountSection | null; country?: string }>({
    section: null,
  });

  if (!user) return null;

  const inReview = user.onboardingStatus !== 'approved';

  const fiscalCountry = COUNTRY_BY_CODE[account.company.fiscalCountry];
  const address = account.addresses[activeCountry];
  const bank = account.banks[activeCountry];

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Cuenta</Typography>
        <Typography variant="body1" color="text.secondary">
          Gestioná la información general de tu cuenta de comercio.
        </Typography>
      </Stack>

      {/* Defensa: si el usuario llega acá fuera del estado approved, bloqueamos edición.
          ProtectedRoute ya redirige los estados inválidos, pero el banner queda como guardia. */}
      {inReview && (
        <ContextBanner
          variant="warning"
          title="Cuenta en revisión"
        >
          Mientras tu cuenta está en revisión, los datos no se pueden editar desde el portal. Si
          necesitás corregir algo, escribinos a Operaciones a soporte@paynau.com.
        </ContextBanner>
      )}

      <SectionCard
        title="Datos de la empresa"
        description="Información legal que se usa en facturación y settlements."
        onEdit={() => setModal({ section: 'company' })}
        editDisabled={inReview}
      >
        <Stack divider={<Divider flexItem />}>
          <KV label="Nombre comercial" value={account.company.commercialName} />
          <KV label="Razón social" value={account.company.legalName} />
          <KV
            label="País fiscal"
            value={
              fiscalCountry
                ? `${fiscalCountry.flag} ${fiscalCountry.name}`
                : account.company.fiscalCountry
            }
          />
          <KV label="ID fiscal" value={account.company.fiscalId} />
          <KV label="Industria" value={account.company.industry} />
          <KV label="Volumen mensual estimado" value={account.company.monthlyVolume} />
        </Stack>
      </SectionCard>

      <SectionCard
        title="Información de contacto"
        description="Cómo te contactamos para asuntos administrativos y soporte."
        onEdit={() => setModal({ section: 'contact' })}
        editDisabled={inReview}
      >
        <Stack divider={<Divider flexItem />}>
          <KV label="Correo corporativo" value={account.contact.corporateEmail} />
          <KV
            label="Teléfono"
            value={`${account.contact.phonePrefix} ${account.contact.phone}`}
          />
          <KV label="Sitio web" value={account.contact.website} />
        </Stack>
      </SectionCard>

      <SectionCard
        title="Dirección comercial"
        description={
          account.operationCountries.length > 1
            ? 'Una dirección por cada país en el que operás.'
            : 'Dirección registrada para operaciones.'
        }
        onEdit={() => setModal({ section: 'address', country: activeCountry })}
        editDisabled={inReview || !address}
      >
        {account.operationCountries.length > 1 && (
          <Tabs
            value={activeCountry}
            onChange={(_, val) => setActiveCountry(val)}
            sx={{ mb: 1 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {account.operationCountries.map(code => {
              const meta = COUNTRY_BY_CODE[code];
              return (
                <Tab
                  key={code}
                  value={code}
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box component="span" sx={{ fontSize: 18 }}>
                        {meta?.flag}
                      </Box>
                      <span>{meta?.name ?? code}</span>
                    </Stack>
                  }
                />
              );
            })}
          </Tabs>
        )}
        {account.operationCountries.length === 1 && (
          <Box sx={{ mb: 1 }}>
            <Chip
              label={`${COUNTRY_BY_CODE[activeCountry]?.flag ?? ''} ${COUNTRY_BY_CODE[activeCountry]?.name ?? activeCountry}`}
              size="small"
              sx={{
                backgroundColor: colors.bgSubtle,
                color: colors.textPrimary,
                fontWeight: 600,
              }}
            />
          </Box>
        )}
        {address ? (
          <Stack divider={<Divider flexItem />}>
            <KV label="Dirección" value={`${address.line1}${address.line2 ? `, ${address.line2}` : ''}`} />
            <KV label="Ciudad" value={address.city} />
            <KV label="Estado / Provincia" value={address.state} />
            <KV label="Código postal" value={address.zip} />
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No hay dirección registrada para este país.
          </Typography>
        )}
      </SectionCard>

      <SectionCard
        title="Información bancaria"
        description="Cuenta donde acreditamos los settlements de tus pagos."
        onEdit={() => setModal({ section: 'bank', country: activeCountry })}
        editDisabled={inReview || !bank}
      >
        {account.operationCountries.length > 1 && (
          <Tabs
            value={activeCountry}
            onChange={(_, val) => setActiveCountry(val)}
            sx={{ mb: 1 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {account.operationCountries.map(code => {
              const meta = COUNTRY_BY_CODE[code];
              return (
                <Tab
                  key={code}
                  value={code}
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box component="span" sx={{ fontSize: 18 }}>
                        {meta?.flag}
                      </Box>
                      <span>{meta?.name ?? code}</span>
                    </Stack>
                  }
                />
              );
            })}
          </Tabs>
        )}
        {bank ? (
          <Stack divider={<Divider flexItem />}>
            <KV label="Banco" value={bank.bankName} />
            <KV label="Titular" value={bank.accountHolder} />
            <KV
              label="Cuenta"
              value={
                <Box component="span" sx={{ fontFamily: 'monospace' }}>
                  {bank.accountNumberMasked}
                </Box>
              }
            />
            <KV label="CLABE / IBAN" value={bank.routingOrIban} />
            <KV label="Moneda" value={bank.currency} />
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No hay cuenta bancaria registrada para este país.
          </Typography>
        )}
      </SectionCard>

      <EditAccountSectionModal
        open={modal.section !== null}
        section={modal.section}
        country={modal.country}
        onClose={() => setModal({ section: null })}
      />
    </Stack>
  );
}

export default AccountSettings;
