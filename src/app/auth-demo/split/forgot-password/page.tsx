import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { ForgotPasswordView } from 'src/auth/view/auth-demo/split';



export const metadata: Metadata = {
    title: `Mot de passe oublié | ${CONFIG.appName}`
};


export default function Page() {
    return <ForgotPasswordView />;
}