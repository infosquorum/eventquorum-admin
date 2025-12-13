'use client';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/admin';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { OrganizerNewEditForm } from '../organizer-new-edit-form';


// ----------------------------------------------------------------------

export function OrganizerCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Créer un nouvel organisateur"
                links={[
                    { name: 'Planifier évènement', href: paths.admin.PLANIFIER_UN_EVENEMENT.root },
                    { name: 'Nouvel organisateur' },
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

            <OrganizerNewEditForm />
        </DashboardContent>
    );
}
