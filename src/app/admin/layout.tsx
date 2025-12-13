//src/app/admin/layout.tsx

import { CONFIG } from 'src/global-config';
// import { AdminLayout } from 'src/layouts/admin';
import { AdminLayout } from 'src/layouts/admin';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return (
    //<AuthGuard>
      <AdminLayout>{children}</AdminLayout>
    //</AuthGuard>
  );
}
