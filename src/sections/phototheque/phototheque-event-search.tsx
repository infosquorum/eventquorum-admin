import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from 'minimal-shared/hooks';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Link, { linkClasses } from '@mui/material/Link';
import type { Theme, SxProps } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';
import type { IEventItem } from 'src/types/event';

// Importer les données mockées
import { _eventList } from 'src/_mock/_events';

type Props = {
  sx?: SxProps<Theme>;
  redirectPath: (name: string) => string;
};

export function EventSearch({ redirectPath, sx }: Props) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<IEventItem | null>(null);

  const debouncedQuery = useDebounce(searchQuery);

  // Simuler la recherche avec les données mockées
  const filteredOptions = useMemo(() => {
    if (!debouncedQuery) return _eventList;
    
    return _eventList.filter((event) =>
      event.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery]);

  const handleChange = useCallback(
    (item: IEventItem | null) => {
      setSelectedItem(item);
      if (item) {
        router.push(redirectPath(item.name));
      }
    },
    [redirectPath, router]
  );

  const paperStyles: SxProps<Theme> = {
    width: 320,
    [` .${autocompleteClasses.listbox}`]: {
      [` .${autocompleteClasses.option}`]: {
        p: 0,
        [` .${linkClasses.root}`]: {
          p: 0.75,
          gap: 1.5,
          width: 1,
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
  };

  return (
    <Autocomplete
      autoHighlight
      popupIcon={null}
      options={filteredOptions}
      value={selectedItem}
      onChange={(event, newValue) => handleChange(newValue)}
      onInputChange={(event, newValue) => setSearchQuery(newValue)}
      getOptionLabel={(option) => option.name}
      noOptionsText={<SearchNotFound query={debouncedQuery} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{ paper: { sx: paperStyles } }}
      sx={[{ width: { xs: 1, sm: 260 } }, ...(Array.isArray(sx) ? sx : [sx])]}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Rechercher un événement..."
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
      renderOption={(props, event, { inputValue }) => {
        const matches = match(event.name, inputValue);
        const parts = parse(event.name, matches);

        return (
          <li {...props} key={event.id}>
            <Link
              component={RouterLink}
              href={redirectPath(event.name)}
              color="inherit"
              underline="none"
            >
              <Avatar
                key={event.id}
                alt={event.name}
                src={event.coverUrl}
                variant="rounded"
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: 1,
                }}
              />

              <div key={inputValue}>
                {parts.map((part, index) => (
                  <Typography
                    key={index}
                    component="span"
                    color={part.highlight ? 'primary' : 'textPrimary'}
                    sx={{
                      typography: 'body2',
                      fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                    }}
                  >
                    {part.text}
                  </Typography>
                ))}
              </div>
            </Link>
          </li>
        );
      }}
    />
  );
}