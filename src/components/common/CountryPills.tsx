import { Box, Stack } from '@mui/material';
import { COUNTRY_BY_CODE } from '@/constants/countries';
import { colors } from '@/theme/tokens';

interface CountryPillsProps {
  countries: string[];
  active: string;
  onChange: (code: string) => void;
}

export function CountryPills({ countries, active, onChange }: CountryPillsProps) {
  if (countries.length === 0) return null;

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {countries.map(code => {
        const country = COUNTRY_BY_CODE[code];
        if (!country) return null;
        const isActive = code === active;
        return (
          <Box
            key={code}
            component="button"
            type="button"
            onClick={() => onChange(code)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              paddingX: 1.5,
              paddingY: 0.75,
              borderRadius: 999,
              border: `1px solid ${isActive ? colors.brandDarkest : colors.borderDefault}`,
              backgroundColor: isActive ? colors.brandDarkest : colors.bgCard,
              color: isActive ? colors.textInverse : colors.textPrimary,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 120ms ease',
              '&:hover': {
                backgroundColor: isActive ? colors.brandDarkest : colors.bgSubtle,
              },
            }}
          >
            <Box component="span" sx={{ fontSize: 16, lineHeight: 1 }}>
              {country.flag}
            </Box>
            <span>{country.name}</span>
          </Box>
        );
      })}
    </Stack>
  );
}

export default CountryPills;
