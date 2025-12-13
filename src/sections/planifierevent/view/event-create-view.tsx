'use client';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/admin';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { EventNewEditForm } from '../event-new-edit-form';

// ----------------------------------------------------------------------

export function EventCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Création d'un événement"
                links={[
                    { name: 'Planifier evenement', href: paths.admin.PLANIFIER_UN_EVENEMENT.root },
                    { name: 'Création d\'évenement' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        href={paths.admin.PLANIFIER_UN_EVENEMENT.root}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:left-fill" />}
                    >
                        Retour
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <EventNewEditForm />
        </DashboardContent>
    );
}
