'use client';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/admin';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import type { CustomerDetails } from 'src/lib/customers/types';

import { ClientNewEditForm } from '../client-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  customer?: CustomerDetails | null;
};

export function ClientEditView({ customer }: Props) {
  // Gérer le cas où le client n'existe pas
  if (!customer) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Client introuvable"
          links={[
            { name: 'Gestion client', href: paths.admin.GESTION_CLIENT.root },
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
        <p>Le client demandé n'existe pas ou a été supprimé.</p>
      </DashboardContent>
    );
  }

  // Nom à afficher selon le type
  const displayName = customer.type === 'Physical'
    ? `${customer.firstName} ${customer.lastName}`
    : customer.name;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Modifier client"
        links={[
          { name: 'Gestion client', href: paths.admin.GESTION_CLIENT.root },
          { name: displayName },
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

      <ClientNewEditForm customer={customer} />
    </DashboardContent>
  );
}