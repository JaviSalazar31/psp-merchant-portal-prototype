import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAccountStore } from '@/stores/accountStore';
import { toast } from '@/stores/toastStore';
import { COUNTRIES, COUNTRY_BY_CODE } from '@/constants/countries';
import { CURRENCIES } from '@/constants/currencies';
import { INDUSTRIES, MONTHLY_VOLUME_RANGES } from '@/constants/industries';
import type { AccountAddress, AccountBank, AccountCompany, AccountContact } from '@/mocks/account';

export type AccountSection = 'company' | 'contact' | 'address' | 'bank';

interface Props {
  open: boolean;
  section: AccountSection | null;
  /** Sólo aplica para 'address' y 'bank' — qué país editar. */
  country?: string;
  onClose: () => void;
}

const SECTION_TITLE: Record<AccountSection, string> = {
  company: 'Editar datos de la empresa',
  contact: 'Editar información de contacto',
  address: 'Editar dirección comercial',
  bank: 'Editar información bancaria',
};

export function EditAccountSectionModal({ open, section, country, onClose }: Props) {
  const account = useAccountStore(s => s.account);
  const saving = useAccountStore(s => s.saving);
  const updateCompany = useAccountStore(s => s.updateCompany);
  const updateContact = useAccountStore(s => s.updateContact);
  const updateAddress = useAccountStore(s => s.updateAddress);
  const updateBank = useAccountStore(s => s.updateBank);

  const [company, setCompany] = useState<AccountCompany>(account.company);
  const [contact, setContact] = useState<AccountContact>(account.contact);
  const [address, setAddress] = useState<AccountAddress | null>(null);
  const [bank, setBank] = useState<AccountBank | null>(null);

  useEffect(() => {
    if (!open || !section) return;
    if (section === 'company') setCompany(account.company);
    if (section === 'contact') setContact(account.contact);
    if (section === 'address' && country) setAddress(account.addresses[country] ?? null);
    if (section === 'bank' && country) setBank(account.banks[country] ?? null);
  }, [open, section, country, account]);

  if (!section) return null;

  const handleSave = async () => {
    if (section === 'company') {
      if (!company.commercialName.trim() || !company.legalName.trim()) {
        toast.error('El nombre comercial y la razón social son obligatorios.');
        return;
      }
      await updateCompany(company);
      toast.success('Datos de la empresa actualizados.');
    } else if (section === 'contact') {
      if (!contact.corporateEmail.trim()) {
        toast.error('El correo corporativo es obligatorio.');
        return;
      }
      await updateContact(contact);
      toast.success('Información de contacto actualizada.');
    } else if (section === 'address' && country && address) {
      await updateAddress(country, address);
      toast.success(`Dirección de ${COUNTRY_BY_CODE[country]?.name ?? country} actualizada.`);
    } else if (section === 'bank' && country && bank) {
      await updateBank(country, bank);
      toast.success(`Información bancaria de ${COUNTRY_BY_CODE[country]?.name ?? country} actualizada.`);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle sx={{ pr: 6 }}>
        {SECTION_TITLE[section]}
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 0.5 }}>
          {section === 'company' && (
            <Stack spacing={2.5}>
              <TextField
                label="Nombre comercial"
                value={company.commercialName}
                onChange={e => setCompany(c => ({ ...c, commercialName: e.target.value }))}
                disabled={saving}
                required
              />
              <TextField
                label="Razón social"
                value={company.legalName}
                onChange={e => setCompany(c => ({ ...c, legalName: e.target.value }))}
                disabled={saving}
                required
              />
              <TextField
                label="ID fiscal"
                value={company.fiscalId}
                onChange={e => setCompany(c => ({ ...c, fiscalId: e.target.value }))}
                disabled={saving}
                helperText="Si necesitás cambiar el país fiscal, contactá a Operaciones."
              />
              <TextField
                select
                label="Industria"
                value={company.industry}
                onChange={e => setCompany(c => ({ ...c, industry: e.target.value as AccountCompany['industry'] }))}
                disabled={saving}
              >
                {INDUSTRIES.map(ind => (
                  <MenuItem key={ind} value={ind}>
                    {ind}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Volumen mensual estimado"
                value={company.monthlyVolume}
                onChange={e => setCompany(c => ({ ...c, monthlyVolume: e.target.value as AccountCompany['monthlyVolume'] }))}
                disabled={saving}
              >
                {MONTHLY_VOLUME_RANGES.map(rng => (
                  <MenuItem key={rng} value={rng}>
                    {rng}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          )}

          {section === 'contact' && (
            <Stack spacing={2.5}>
              <TextField
                label="Correo corporativo"
                type="email"
                value={contact.corporateEmail}
                onChange={e => setContact(c => ({ ...c, corporateEmail: e.target.value }))}
                disabled={saving}
                required
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  select
                  label="Prefijo"
                  value={contact.phonePrefix}
                  onChange={e => setContact(c => ({ ...c, phonePrefix: e.target.value }))}
                  disabled={saving}
                  sx={{ maxWidth: { sm: 140 } }}
                >
                  {COUNTRIES.map(c => (
                    <MenuItem key={c.code} value={c.phonePrefix}>
                      {c.flag} {c.phonePrefix}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Teléfono"
                  value={contact.phone}
                  onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                  disabled={saving}
                  sx={{ flex: 1 }}
                />
              </Stack>
              <TextField
                label="Sitio web"
                value={contact.website}
                onChange={e => setContact(c => ({ ...c, website: e.target.value }))}
                disabled={saving}
                helperText="Sin http:// ni https://"
              />
            </Stack>
          )}

          {section === 'address' && address && (
            <Stack spacing={2.5}>
              <TextField
                label="Dirección (línea 1)"
                value={address.line1}
                onChange={e => setAddress(a => (a ? { ...a, line1: e.target.value } : a))}
                disabled={saving}
              />
              <TextField
                label="Dirección (línea 2)"
                value={address.line2}
                onChange={e => setAddress(a => (a ? { ...a, line2: e.target.value } : a))}
                disabled={saving}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Ciudad"
                  value={address.city}
                  onChange={e => setAddress(a => (a ? { ...a, city: e.target.value } : a))}
                  disabled={saving}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Estado / Provincia"
                  value={address.state}
                  onChange={e => setAddress(a => (a ? { ...a, state: e.target.value } : a))}
                  disabled={saving}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Código postal"
                  value={address.zip}
                  onChange={e => setAddress(a => (a ? { ...a, zip: e.target.value } : a))}
                  disabled={saving}
                  sx={{ flex: 1 }}
                />
              </Stack>
            </Stack>
          )}

          {section === 'bank' && bank && (
            <Stack spacing={2.5}>
              <TextField
                label="Banco"
                value={bank.bankName}
                onChange={e => setBank(b => (b ? { ...b, bankName: e.target.value } : b))}
                disabled={saving}
              />
              <TextField
                label="Titular de la cuenta"
                value={bank.accountHolder}
                onChange={e => setBank(b => (b ? { ...b, accountHolder: e.target.value } : b))}
                disabled={saving}
              />
              <TextField
                label="Número de cuenta"
                value={bank.accountNumberMasked}
                onChange={e =>
                  setBank(b => (b ? { ...b, accountNumberMasked: e.target.value } : b))
                }
                disabled={saving}
                helperText="Mostramos los últimos dígitos enmascarados por seguridad."
              />
              <TextField
                select
                label="Moneda"
                value={bank.currency}
                onChange={e => setBank(b => (b ? { ...b, currency: e.target.value } : b))}
                disabled={saving}
              >
                {CURRENCIES.map(cur => (
                  <MenuItem key={cur.code} value={cur.code}>
                    {cur.code} — {cur.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="CLABE / IBAN / Routing"
                value={bank.routingOrIban}
                onChange={e => setBank(b => (b ? { ...b, routingOrIban: e.target.value } : b))}
                disabled={saving}
              />
            </Stack>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditAccountSectionModal;
