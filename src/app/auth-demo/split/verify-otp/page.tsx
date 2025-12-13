import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { VerifyOtpView } from 'src/auth/view/auth-demo/split';


export const metadata: Metadata = {
    title: `Vérification OTP | ${CONFIG.appName}`
};


export default function Page() {
    return <VerifyOtpView />;
}