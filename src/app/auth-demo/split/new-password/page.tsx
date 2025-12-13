import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { NewPasswordView } from 'src/auth/view/auth-demo/split';


export const metadata: Metadata = {
    title: `Nouveau mot de passe | ${CONFIG.appName}`
};


export default function Page() {
    return <NewPasswordView />;
}
