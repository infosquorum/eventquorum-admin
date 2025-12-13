import type { IJobItem } from 'src/types/job';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { fDate } from 'src/utils/format-time';
import { fFCFA } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { IClientItem } from 'src/types/client';
import { Divider, LinearProgress } from '@mui/material';
import { Label } from 'src/components/label';
import { primary, success } from 'src/theme';

// ----------------------------------------------------------------------

type Props = {
    client?: IClientItem;
};

export function FicheClientContent({ client }: Props) {

    const renderClientHeader = () => (
        <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
                alt={client?.isMoralePerson ? client?.company_name : `${client?.contact_firstname} ${client?.contact_name}`}
                src={client?.isMoralePerson ? client?.logo : client?.personLogo}
                variant="rounded"
                sx={{ width: 64, height: 64 }}
            />
            <Stack spacing={1}>
                <Typography variant="h4">
                    {client?.isMoralePerson ? client?.company_name : `${client?.contact_firstname} ${client?.contact_name}`}
                </Typography>
                <Typography variant="body2">
                    Type de client : {client?.isMoralePerson ? 'Personne morale' : 'Personne physique'}
                </Typography>
            </Stack>
        </Stack>
    );

    const renderCompanyInfo = () => (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>INFOS ENTREPRISE</Typography>
            <Stack spacing={1}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2">Nom de l'entreprise:</Typography>
                    <Typography variant="subtitle2">{client?.company_name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2">Adresse:</Typography>
                    <Typography variant="subtitle2">{client?.address}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2">Email:</Typography>
                    <Typography variant="subtitle2">{client?.email}</Typography>
                </Box>
            </Stack>
        </Box>
    );

    const renderContactInfo = () => (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {client?.isMoralePerson ? 'INFOS CORRESPONDANT' : 'INFOS CLIENT'}
            </Typography>
            <Stack spacing={1}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2">Nom:</Typography>
                    <Typography variant="subtitle2">{client?.contact_name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2">Prénom:</Typography>
                    <Typography variant="subtitle2">{client?.contact_firstname}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2">Téléphone:</Typography>
                    <Typography variant="subtitle2">{client?.phoneNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2">Email:</Typography>
                    <Typography variant="subtitle2">{client?.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2">Adresse:</Typography>
                    <Typography variant="subtitle2">{client?.address}</Typography>
                </Box>
            </Stack>
        </Box>
    );


    const renderStats = () => (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            {[
                { label: 'Solde', value: '5 000 000', suffix: 'FCFA' },
                { label: 'Nbre evenements', value: '03' },
                { label: "Nbre d'invités (moy)", value: '300' },
                { label: 'Nbre participants (moy)', value: '450' },
            ].map((stat) => (
                <Card key={stat.label} sx={{ p: 2, flexGrow: 1, minWidth: 200 }}>
                    <Typography variant="subtitle2" color={'grey.500'} sx={{ mb: 1 }}>{stat.label}</Typography>
                    <Typography variant="h6" >
                        {stat.value}
                        {stat.suffix && <Typography component="span" variant="h6"> {stat.suffix}</Typography>}
                    </Typography>
                </Card>

            ))}
        </Box>
    );

    const renderPaymentMethods = () => (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            {[
                { name: 'Orange', amount: '1000000' },
                { name: 'MTN', amount: '1000000' },
                { name: 'Wave', amount: '1000000' },
                { name: 'Carte bancaire', amount: '2000000' },
            ].map((method) => (
                <Card key={method.name} sx={{ p: 2, flexGrow: 1, minWidth: 200 }}>
                    <Typography variant="subtitle2" color={'grey.500'} sx={{ mb: 1 }}>{method.name}</Typography>
                    <Typography variant="h6">
                        {fFCFA(method.amount)}
                        {/* <Typography component="span" variant="caption"> devise</Typography> */}
                    </Typography>
                </Card>
            ))}
        </Box>
    );

    const renderEvents = () => (
        <Stack spacing={2}>
            {[1, 2, 3].map((num) => (
                <>
                    <Accordion key={num}>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant='subtitle2'>Evenement {num}</Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            <>
                                <PaymentDashboard />
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                                    {[
                                        { label: 'Enquête', value: '5/7' },
                                        { label: 'Nbre inscrits', value: '80' },
                                        { label: 'Nbre invités', value: '90' },
                                        { label: 'Nbre participants', value: '50' },
                                    ].map((stat) => (
                                        <Card key={stat.label} sx={{ p: 2, flexGrow: 1 }}>
                                            <Typography variant="subtitle2" color={'grey.500'}>{stat.label}</Typography>
                                            <Typography variant="h6">{stat.value}</Typography>
                                        </Card>
                                    ))}
                                </Box>

                                <Table>
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
                                        {[
                                            { activity: 'Workshop', inscrits: '50', invites: '80', participants: '50', montant: '2 000 000', statut: 'Terminer' },
                                            { activity: 'Workshop cyber', inscrits: '70', invites: '80', participants: '45', montant: '---', statut: 'En cours' },
                                            { activity: 'Cyber', inscrits: '70', invites: '70', participants: '50', montant: '300 000', statut: 'Non démarrer' },
                                        ].map((row) => (
                                            <TableRow key={row.activity}>
                                                <TableCell>{row.activity}</TableCell>
                                                <TableCell>{row.inscrits}</TableCell>
                                                <TableCell>{row.invites}</TableCell>
                                                <TableCell>{row.participants}</TableCell>
                                                <TableCell>{row.montant}</TableCell>
                                                <TableCell>
                                                    <Label
                                                        variant="soft"
                                                        color={
                                                            (row.statut === 'Terminer' && 'success') ||
                                                            (row.statut === 'En cours' && 'warning') ||
                                                            'error'
                                                        }
                                                    >
                                                        {row.statut}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </>
                        </AccordionDetails>
                    </Accordion>
                </>
            ))}
        </Stack>
    );

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
                {renderClientHeader()}
                <Divider variant="fullWidth" />

                {client?.isMoralePerson ? (
                    <>
                        {renderCompanyInfo()}
                        <Divider variant="fullWidth" />
                        {renderContactInfo()}
                    </>
                ) : (
                    renderContactInfo()
                )}
            </Card>
                
            </Grid>
            {/* <Card sx={{ p: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
                {renderClientHeader()}
                <Divider variant="fullWidth" />

                {client?.isMoralePerson ? (
                    <>
                        {renderCompanyInfo()}
                        <Divider variant="fullWidth" />
                        {renderContactInfo()}
                    </>
                ) : (
                    renderContactInfo()
                )}
            </Card> */}

            <Grid size={{ xs: 12, md: 8 }}>
                {renderStats()}
                {renderPaymentMethods()}
                {renderEvents()}
            </Grid>
        </Grid>
    );
}

const PaymentDashboard = () => {
    const paymentMethods = [
        { name: 'Wave', amount: 59.8, value: 3740000, color: '#00B7FF' },
        { name: 'Orange Money', amount: 24.3, value: 1519000, color: '#FF7900' },
        { name: 'MTN Mobile Money', amount: 8.0, value: 500000, color: '#FFC107' },
        { name: 'Moov Money', amount: 4.8, value: 300000, color: '#FF4B26' },
        { name: 'Carte bancaire', amount: 3.2, value: 200000, color: '#2196F3' }
    ];

    const totalBalance = paymentMethods.reduce((sum, method) => sum + method.value, 0);

    return (
        <Box sx={{
            width: '100%',
            maxWidth: 1200,
            p: 2,
            display: 'flex',
            gap: 3
        }}>
            {/* Left side - Balance Card (1/3) */}
            <Card sx={{
                flex: '0 0 33.333%',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: 160,
            }}>
                <Typography variant="h6" color={'grey.400'}>Solde total</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {totalBalance.toLocaleString()} FCFA
                </Typography>
            </Card>

            {/* Right side - Payment Methods (2/3) */}
            <Card sx={{
                flex: '0 0 66.666%',
                p: 3
            }}>
                {paymentMethods.map((method) => (
                    <Box key={method.name} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2">{method.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2">
                                    {method.value.toLocaleString()} FCFA
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ({method.amount}%)
                                </Typography>
                            </Box>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={method.amount}
                            sx={{
                                height: 8,
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

