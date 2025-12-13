// src/sections/client/view/client-create-view.tsx

'use client';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/admin';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ClientNewEditForm } from '../client-new-edit-form';

// ----------------------------------------------------------------------

export function ClientCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Créer un nouveau client"
        links={[
          { name: 'Gestion client', href: paths.admin.GESTION_CLIENT.root },
          { name: 'Nouveau client' },
        ]}
        action={
          <Button
              component={RouterLink}
              href={paths.admin.GESTION_CLIENT.root}
              variant="contained"
              startIcon={<Iconify icon="mingcute:left-fill" />}
          >
              Retour
          </Button>
      }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ClientNewEditForm />
    </DashboardContent>
  );
}
