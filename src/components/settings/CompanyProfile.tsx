import { useState } from 'react';
import { Box, Card, CardContent, Chip, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import ContextBanner from '@/components/common/ContextBanner';
import { useAccountStore } from '@/stores/accountStore';
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
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h4">{title}</Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Stack>
          <Divider />
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

function CountryTabs({
  countries,
  active,
  onChange,
}: {
  countries: string[];
  active: string;
  onChange: (c: string) => void;
}) {
  if (countries.length <= 1) {
    const meta = COUNTRY_BY_CODE[active];
    return (
      <Box sx={{ mb: 1 }}>
        <Chip
          label={`${meta?.flag ?? ''} ${meta?.name ?? active}`}
          size="small"
          sx={{ backgroundColor: colors.bgSubtle, color: colors.textPrimary, fontWeight: 600 }}
        />
      </Box>
    );
  }
  return (
    <Tabs
      value={active}
      onChange={(_, val) => onChange(val)}
      sx={{ mb: 1 }}
      variant="scrollable"
      scrollButtons="auto"
    >
      {countries.map(code => {
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
  );
}

/**
 * Pantalla /profile/wizard — datos del comercio capturados en el onboarding.
 * Sólo lectura: una vez aprobada la cuenta, las correcciones se gestionan con Backoffice.
 */
export function CompanyProfile() {
  const account = useAccountStore(s => s.account);
  const [activeCountry, setActiveCountry] = useState<string>(
    account.operationCountries[0] ?? 'MX',
  );

  const fiscalCountry = COUNTRY_BY_CODE[account.company.fiscalCountry];
  const address = account.addresses[activeCountry];
  const bank = account.banks[activeCountry];

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Perfil del comercio</Typography>
        <Typography variant="body1" color="text.secondary">
          Datos de tu empresa registrados durante el onboarding.
        </Typography>
      </Stack>

      <ContextBanner variant="info" title="Estos datos son de sólo lectura">
        Para cambios en los datos del comercio, escribinos a Backoffice a soporte@paynau.com.
      </ContextBanner>

      <SectionCard
        title="Datos de la empresa"
        description="Información legal que se usa en facturación y settlements."
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
      >
        <CountryTabs
          countries={account.operationCountries}
          active={activeCountry}
          onChange={setActiveCountry}
        />
        {address ? (
          <Stack divider={<Divider flexItem />}>
            <KV
              label="Dirección"
              value={`${address.line1}${address.line2 ? `, ${address.line2}` : ''}`}
            />
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
      >
        <CountryTabs
          countries={account.operationCountries}
          active={activeCountry}
          onChange={setActiveCountry}
        />
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
    </Stack>
  );
}

export default CompanyProfile;
