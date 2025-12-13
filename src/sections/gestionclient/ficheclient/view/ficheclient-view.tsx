'use client';

// import type { IUserItem } from 'src/types/user';

import type { IClientItem } from 'src/types/client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/admin';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from 'src/sections/user/user-new-edit-form';

import { FicheClientToolbar } from '../ficheclient-toolbar';
import { FicheClientContent } from '../ficheclient-content';
import { FicheClientContentV2 } from '../ficheclient-contentv2';

// import { UserNewEditForm } from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  client?: IClientItem;
};

export function FicheClientView({ client: currentClient }: Props) {
  return (
    <DashboardContent maxWidth='xl'>
      <FicheClientToolbar
            backHref={paths.admin.GESTION_CLIENT.root}
            editHref={paths.admin.GESTION_CLIENT.ficheclient(`${currentClient?.id}`)}
      />
      {/* <UserNewEditForm currentUser={currentClient} /> */}
      <FicheClientContentV2 client={currentClient} />
    </DashboardContent>
  );
}
