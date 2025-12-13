import Grid from '@mui/material/Grid2';
//src/sections/gestionclient/ficheclient/tabs/ficheclient-home.tsx
import { Avatar, Box, Card, CardHeader, Stack, Typography } from '@mui/material';

import { fFCFA } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';
import { _bookingsOverview } from 'src/_mock';

import { SvgColor } from 'src/components/svg-color';

import { BookingBooked } from 'src/sections/overview/booking/booking-booked';
import { AdminCurrentBalance } from 'src/sections/overview/admin/admin-current-balance';
import { BookingTotalIncomes } from 'src/sections/overview/booking/booking-total-incomes';

import { IClientItem } from 'src/types/client';

import { FicheClientSolde } from '../ficheclient-solde-widget';
import { FicheClientHomeWidget } from '../ficheclient-home-widget';
import FicheClientPaymentMethodsProgress from '../ficheclient-payment-methods-progress';

type Props = {
    client?: IClientItem;
};

export function FicheClientHome({ client }: Props) {

    const renderInfoBox = (label: string, value?: string) => (
        <Box sx={{
            display: 'flex',
            gap: 2,
            // flexDirection: { xs: 'column', sm: 'row' },
            // alignItems: { xs: 'flex-start', sm: 'center' }
        }}>
            <Typography variant="body2" >{label}:</Typography>
            <Typography variant="subtitle2">{value}</Typography>
        </Box>
    );

    const renderCompanyInfo = () => (
        <Card sx={{ p: { xs: 2, sm: 3 }, height: 270 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>INFOS ENTREPRISE</Typography>
            <Stack spacing={2}>
                {renderInfoBox("Nom de l'entreprise", client?.company_name)}
                {renderInfoBox("Adresse", client?.address)}
                {renderInfoBox("Email", client?.email)}
            </Stack>
        </Card>
    );

    const renderContactInfo = () => (
        <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {client?.isMoralePerson ? 'INFOS CORRESPONDANT' : 'INFOS CLIENT'}
            </Typography>
            <Stack spacing={2}>
                {renderInfoBox("Nom", client?.contact_name)}
                {renderInfoBox("Prénom", client?.contact_firstname)}
                {renderInfoBox("Téléphone", client?.phoneNumber)}
                {renderInfoBox("Email", client?.email)}
                {renderInfoBox("Adresse", client?.address)}
            </Stack>
        </Card>
    );

    const renderStats = () => (

        <Grid container spacing={2} sx={{ pb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FicheClientHomeWidget
                    title="Nbre Evenements"
                    total={3}
                    color="secondary"
                    icon={
                        <img
                            alt="Weekly sales"
                            src={`${CONFIG.assetsDir}/assets/icons/fluent/ic-event.svg`}
                            style={{ width: 44, height: 44 }}
                        />

                    }
                    sx={{ height: 180 }}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FicheClientHomeWidget
                    title="Participants (moy)"
                    total={200}
                    color="success"
                    icon={
                        <img
                            alt="New users"
                            src={`${CONFIG.assetsDir}/assets/icons/fluent/ic-participant.svg`}
                            style={{ width: 44, height: 44 }}
                        />
                    }
                    sx={{ height: 180 }}

                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FicheClientHomeWidget
                    title="Invités (moy)"
                    total={220}
                    color="warning"
                    icon={
                        <img
                            alt="Purchase orders"
                            src={`${CONFIG.assetsDir}/assets/icons/fluent/ic-guest.svg`}
                            style={{ width: 44, height: 44 }}
                        />

                    }
                    sx={{ height: 180 }}

                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FicheClientHomeWidget
                    title="Inscrits (moy)"
                    total={234}
                    color="error"
                    icon={
                        <img
                            alt="Messages"
                            src={`${CONFIG.assetsDir}/assets/icons/fluent/ic-registered.svg`}
                            style={{ width: 44, height: 44 }}
                        />

                    }
                    sx={{ height: 180 }}

                />
            </Grid>
        </Grid>
    );

    // On l'utilise pas pour l'instant
    const renderPayment = () => {
        const paymentData = [
            {
                name: 'Wave',
                amount: '3 740 000 FCFA',
                percentage: 59.8,
                color: '#00c1d4',
                icon: '/assets/icons/payment/wave.png'
            },
            {
                name: 'Orange Money',
                amount: '1 519 000 FCFA',
                percentage: 24.3,
                color: '#ff7900',
                icon: '/assets/icons/payment/orange.svg'
            },
            {
                name: 'MTN Mobile Money',
                amount: '500 000 FCFA',
                percentage: 8.0,
                color: '#ffcc00',
                icon: '/assets/icons/payment/MTN.png'
            },
            {
                name: 'Moov Money',
                amount: '300 000 FCFA',
                percentage: 4.8,
                color: '#0066ff',
                icon: '/assets/icons/payment/moovci_good.png'
            },
            {
                name: 'Carte bancaire',
                amount: '200 000 FCFA',
                percentage: 3.2,
                color: '#9c27b0',
                icon: '/assets/icons/payment/carte.png'
            }
        ];


        return (
            
                <Box
                    sx={{
                        p: { md: 1 },
                        display: 'grid',
                        gap: { xs: 3, md: 0 },
                        borderRadius: { md: 2 },
                        bgcolor: { md: 'background.paper' },
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: '2fr 1fr' },
                    }}
                >

                    {/* <FicheClientSolde
                        title="Solde"
                        total={1876550}
                        percent={2.6}
                        chart={{
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                            series: [{ data: [50000, 95000, 120000, 180000, 250000, 320000, 400000, 450000, 549550] }],
                        }}
                        // sx={{ width: 300 }}
                    /> */}

                    <FicheClientPaymentMethodsProgress
                        // title="Moyens de paiements"
                        data={paymentData}
                        sx={{ boxShadow: { md: 'none' } }}
                    // sx = {{ height: 300}}
                    />

                    <AdminCurrentBalance
                        title='Solde actuel'
                        received={2000000}
                        refunded={500000}
                        currentBalance={1500000}
                        sx={{ height: 300 }}
                    />
                </Box>
            
        )
    };

    return (
        <Grid container spacing={3}>
            {client?.isMoralePerson ? (
                <>
                    <Grid size={{ xs: 12, md: 6 }}>
                        {renderCompanyInfo()}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        {renderContactInfo()}
                    </Grid>
                </>
            ) : (
                <Grid size={{ xs: 12 }}>
                    {renderContactInfo()}
                </Grid>
            )}
            <Grid size={{ xs: 12 }}>
                <Card sx={{ p: { xs: 2, sm: 3 } }}>
                    <CardHeader title={<Typography variant='h5'>Statistiques</Typography>} sx={{ pb: 2 }} />
                    {renderStats()}
                    {/* {renderPayment()} */}
                </Card>
            </Grid>
        </Grid>
    );
}