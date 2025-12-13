// components/phototheque/PhotothequeListView.tsx
'use client';

import { useState } from 'react';
import { orderBy } from 'es-toolkit';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Iconify } from 'src/components/iconify';

import { paths } from 'src/routes/paths';
import type { IEventItem, IEventPhoto } from 'src/types/event';
import { EventSearch } from '../phototheque-event-search';
import { EventSort } from '../phototheque-event-sort';
import { EventList } from '../event-list';
import { Lightbox } from 'src/components/lightbox';
import { Image } from 'src/components/image';

const SORT_OPTIONS = [
    { value: 'recent', label: 'Recent' },
    { value: 'ancien', label: 'Plus ancien' },
    { value: 'populaire', label: 'Populaire' },
];

type Props = {
    events: IEventItem[];
};

export function PhotothequeListView({ events }: Props) {
    const [sortBy, setSortBy] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');

    const dataFiltered = applyFilter({
        inputData: events,
        sortBy,
        searchQuery,
    });

    return (
        <Container>
            <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
                Photothèque
            </Typography>

            <Box
                // sx={{
                //     display: 'flex',
                //     justifyContent: 'space-between',
                //     mb: 3,
                //     flexWrap: 'wrap',
                //     gap: 2
                // }}
                sx={[
                    () => ({
                        gap: 3,
                        display: 'flex',
                        mb: { xs: 3, md: 5 },
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-end', sm: 'center' },
                    }),
                ]}
            >
                <EventSearch
                    // value={searchQuery}
                    // onChange={(value) => setSearchQuery(value)}
                    redirectPath={(name: string) => paths.admin.PHOTOTHEQUE.detailevent(name)}
                />
                <EventSort
                    sort={sortBy}
                    onSort={(value) => setSortBy(value)}
                    sortOptions={SORT_OPTIONS}
                />
            </Box>

            {/* <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 3,
                mb: 5
            }}>
                {dataFiltered.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </Box> */}

            <EventList events={dataFiltered} />
        </Container>
    );
}

// Logique de filtrage
function applyFilter({
    inputData,
    sortBy,
    searchQuery
}: {
    inputData: IEventItem[];
    sortBy: string;
    searchQuery: string;
}) {
    let filtered = [...inputData];

    // Recherche
    if (searchQuery) {
        filtered = filtered.filter(
            (event) =>
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Tri
    if (sortBy === 'recent') {
        return orderBy(filtered, ['createdAt'], ['desc']);
    }
    if (sortBy === 'ancien') {
        return orderBy(filtered, ['createdAt'], ['asc']);
    }
    if (sortBy === 'populaire') {
        return orderBy(filtered, ['likes'], ['desc']);
    }

    return filtered;
}