import {
    Stack,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    Box,
    Card,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    LinearProgress,
    Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Iconify } from "src/components/iconify";
import { Label } from "src/components/label";
import { IClientItem } from "src/types/client";
import { FicheClientSolde } from "../ficheclient-solde-widget";
import { FicheClientHomeWidget } from "../ficheclient-home-widget";
import { CONFIG } from "src/global-config";
import { varAlpha } from "minimal-shared/utils";
import { useTheme } from '@mui/material/styles';
import { Scrollbar } from "src/components/scrollbar";
import { FicheClientEventWidget } from "../ficheclient-event-tab-widget";

// ----------------------------------------------------------------

// Types
type PaymentMethod = {
    name: string;
    amount: number;
    value: number;
    color: string;
};

type Activity = {
    activity: string;
    inscrits: string;
    invites: string;
    participants: string;
    montant: string;
    statut: 'Terminer' | 'En cours' | 'Non démarrer';
};

type ValidColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';


export type EventData = {
    id: number;
    name: string;
    date: string;
    participants: number;
    inscriptions: number;
    invites: number;
    amountReceived: number;
    paymentMethods: PaymentMethod[];
    activities: Activity[];
    survey?: string;
};

type Props = {
    client?: IClientItem;
    eventData: EventData[];
};

// ----------------------------------------------------------------

export function FicheClientEvenement({ eventData }: Props) {

    const theme = useTheme();

    const renderTable = (activities: Activity[]) => (
        <Box sx={{ overflow: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Activité</TableCell>
                        <TableCell>Inscrits</TableCell>
                        <TableCell>Invités</TableCell>
                        <TableCell>Participants</TableCell>
                        <TableCell>Montant reçu</TableCell>
                        <TableCell>Statut</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activities.map((activity) => (
                        <TableRow key={activity.activity}>
                            <TableCell>{activity.activity}</TableCell>
                            <TableCell>{activity.inscrits}</TableCell>
                            <TableCell>{activity.invites}</TableCell>
                            <TableCell>{activity.participants}</TableCell>
                            <TableCell>{activity.montant}</TableCell>
                            <TableCell>
                                <Label
                                    variant="soft"
                                    color={
                                        (activity.statut === 'Terminer' && 'success') ||
                                        (activity.statut === 'En cours' && 'warning') ||
                                        'error'
                                    }
                                >
                                    {activity.statut}
                                </Label>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );


    const renderEvents = () => {
        return (
            <Card sx={{ p: { xs: 2, sm: 3 }, backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.04), }}>
                <Box>
                    <Stack spacing={2}>
                        {eventData.map((event) => (
                            <Accordion key={event.id}>
                                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                                    <Typography variant="h6" sx={{color: 'text.secondary'}}>Évènement : {event.name}</Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <>
                                        {/* <Grid container spacing={2} sx={{ pb: 3 }}>
                                            {[
                                                {
                                                    label: 'Enquête',
                                                    value: event.survey || '0/0',
                                                    color: 'primary',
                                                    iconSrc: `${CONFIG.assetsDir}/assets/icons/glass/ic-glass-bag.svg`,
                                                    altText: 'Survey icon'
                                                },
                                                {
                                                    label: 'Nbre inscrits',
                                                    value: event.inscriptions,
                                                    color: 'error',
                                                    iconSrc: `${CONFIG.assetsDir}/assets/icons/glass/ic-glass-message.svg`,
                                                    altText: 'Inscriptions icon'
                                                },
                                                {
                                                    label: 'Nbre invités',
                                                    value: event.invites,
                                                    color: 'warning',
                                                    iconSrc: `${CONFIG.assetsDir}/assets/icons/glass/ic-glass-arrow.svg`,
                                                    altText: 'Invites icon'
                                                },
                                                {
                                                    label: 'Nbre participants',
                                                    value: event.participants,
                                                    color: 'secondary',
                                                    iconSrc: `${CONFIG.assetsDir}/assets/icons/glass/ic-glass-users.svg`,
                                                    altText: 'Participants icon'
                                                }
                                            ].map((stat) => (
                                                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
                                                    <FicheClientHomeWidget
                                                        title={stat.label}
                                                        total={stat.label === 'Enquête' ? 0 : Number(stat.value)}
                                                        totalString={stat.label === 'Enquête' ? String(stat.value) : undefined}
                                                        color={stat.color as ValidColor}
                                                        icon={
                                                            <img
                                                                alt={stat.altText}
                                                                src={stat.iconSrc}
                                                            />
                                                        }
                                                        sx={{ height: 180 }}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid> */}
                                        <Card sx={{ mb: { xs: 3, md: 5 }, pt: 1 }}>
                                            <Scrollbar sx={{ minHeight: 108 }}>
                                                <Stack
                                                    divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                                                    sx={{ py: 2, flexDirection: 'row' }}
                                                >
                                                    {[
                                                        {
                                                            label: 'Enquêtes',
                                                            value: '3/4',
                                                            color: 'info' as const,
                                                            icon: 'solar:clipboard-list-bold-duotone',
                                                            percent: 100,
                                                            price: 24
                                                        },
                                                        {
                                                            label: 'Participants',
                                                            value: 45,
                                                            color: 'success' as const,
                                                            icon: 'solar:user-check-bold-duotone',
                                                            percent: 100,
                                                            price: 67
                                                        },
                                                        {
                                                            label: 'Invités',
                                                            value: 55,
                                                            color: 'warning' as const,
                                                            icon: 'solar:user-bold-duotone',
                                                            percent: 100,
                                                            price: 90
                                                        },
                                                        {
                                                            label: 'Inscrits',
                                                            value: 90,
                                                            color: 'error' as const,
                                                            icon: 'solar:user-hand-up-bold-duotone',
                                                            percent: 100,
                                                            price: 654
                                                        },
                                                    ].map((stat) => (
                                                        <FicheClientEventWidget
                                                            title={stat.label}
                                                            total={stat.value.toString()}
                                                            percent={stat.percent}
                                                            price={stat.price}
                                                            icon={stat.icon}
                                                            color={theme.vars.palette[stat.color].main}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Scrollbar>
                                        </Card>
                                        <PaymentDashboard paymentMethods={event.paymentMethods} />


                                        <Typography variant='subtitle1' sx={{ p: 2, color: 'text.secondary' }}>Liste des activités</Typography>
                                        {renderTable(event.activities)}
                                    </>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Stack>
                </Box>
            </Card>
        );
    }

    return (
        <Grid size={{ xs: 12 }}>
            <Typography variant='h4' sx={{ p: 2 }}>Liste des évènements</Typography>
            {renderEvents()}
        </Grid>
    );
}

type PaymentDashboardProps = {
    paymentMethods: PaymentMethod[];
};

const PaymentDashboard = ({ paymentMethods }: PaymentDashboardProps) => {

    const totalBalance = paymentMethods.reduce((sum, method) => sum + method.value, 0);

    return (
        <Box sx={{
            width: '100%',
            maxWidth: 1200,
            p: { xs: 1, sm: 2 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 3 }
        }}>
            <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
                <FicheClientSolde
                    title="Montant total reçu"
                    total={totalBalance}
                    percent={2.6}
                    chart={{
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                        series: [{ data: [50000, 95000, 120000, 180000, 250000, 320000, 400000, 450000, 549550] }],
                    }}
                    sx={{ maxHeight: {md: 370}}}
                />
            </Box>

            <Card sx={{
                width: { xs: '100%', md: '66.666%' },
                p: { xs: 2, sm: 3 },
                maxHeight: {md: 370},
            }}>
                {paymentMethods.map((method) => (
                    <Box key={method.name} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            mb: 1
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 1, sm: 0 } }}>
                                <Typography variant="body1">{method.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1">
                                    {method.value.toLocaleString()} FCFA
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    ({method.amount}%)
                                </Typography>
                            </Box>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={method.amount}
                            sx={{
                                height: 9,
                                borderRadius: 1,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: method.color,
                                    borderRadius: 1,
                                },
                            }}
                        />
                    </Box>
                ))}
            </Card>
        </Box>
    );
};