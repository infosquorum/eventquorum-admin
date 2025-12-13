'use client';

import React, { useState } from 'react';
import { Box, Button, Card, Tab, Typography, Chip, Accordion, AccordionDetails, AccordionSummary, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { useTabs } from 'minimal-shared/hooks';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CustomTabs } from 'src/components/custom-tabs';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/admin';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { PaymentMethodsList, PAYMENT_DATA } from 'src/sections/overview/admin/admin-sales-overview';
import { AdminTotalIncomes } from 'src/sections/overview/admin/admin-total-incomes';
import { CourseWidgetSummary } from 'src/sections/overview/course/course-widget-summary';
import { IEventItem } from 'src/types/event';
import { Label } from 'src/components/label';
import { EventTabComponents } from '../detail-evenement-tabs';
import { FicheClientSolde } from 'src/sections/gestionclient/ficheclient/ficheclient-solde-widget';
import { ITourItem } from 'src/types/tour';

import { DetailEventHero } from './detailevent-hero-view';
import { DetailEventWidgetSummary } from '../detailevent-widget-summary';
import { toast } from 'src/components/snackbar';

type Props = {
    event?: IEventItem;
};

const TABS = [
    { value: 'agenda', icon: <Iconify width={24} icon="solar:clipboard-list-bold" />, label: 'Agenda' },
    { value: 'acces_list', icon: <Iconify width={24} icon="solar:shield-user-bold" />, label: 'Liste des accès' },
    { value: 'phototheque', icon: <Iconify width={24} icon="solar:camera-bold" />, label: 'Photothèque' },
    { value: 'bilan', icon: <Iconify width={24} icon="solar:chart-2-bold" />, label: 'Bilan Financier' },
];


const TAB_COMPONENTS = {
    agenda: EventTabComponents.AgendaTab,
    acces_list: EventTabComponents.AccessListTab,
    phototheque: EventTabComponents.PhotothequeTab,
    bilan: EventTabComponents.bilanFinancierTab,
} as const;

type TabKey = keyof typeof TAB_COMPONENTS;

interface SuspendDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const SuspendConfirmDialog = ({ open, onClose, onConfirm }: SuspendDialogProps) => (
    <Dialog open={open} onClose={onClose} >
        <DialogTitle>Confirmer la suspension</DialogTitle>
        <DialogContent>
            Êtes-vous sûr de vouloir suspendre cet évènement ? Il ne sera plus accessible.
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Annuler</Button>
            <Button onClick={onConfirm} color="error" variant="contained">
                Suspendre
            </Button>
        </DialogActions>
    </Dialog>
);

interface SuspendButtonProps {
    onStatusChange: (newStatus: string) => void;
}

const SuspendButton = ({ onStatusChange }: SuspendButtonProps) => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleSuspendEvent = async () => {
        try {
            // Here you would make an API call to update the event status
            // await updateEventStatus(eventId, 'suspendu');

            onStatusChange('suspendu');
            toast.success('L\'évènement a été suspendu avec succès. Il n\'est plus accessible.');
            setOpenDialog(false);
        } catch (error) {
            toast.error('Une erreur est survenue lors de la suspension de l\'évènement.');
            console.error(error);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="mdi:pause-circle" />}
                onClick={() => setOpenDialog(true)}
            // sx={{ position: 'absolute', top: 20, right: 20 }}
            >
                Suspendre l'évènement
            </Button>

            <SuspendConfirmDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleSuspendEvent}
            />
        </>
    );
};

interface ReactivateButtonProps {
    onStatusChange: (newStatus: string) => void;
}

const ReactivateButton = ({ onStatusChange }: ReactivateButtonProps) => {
    const handleReactivate = async () => {
        try {
            onStatusChange('actif');
            toast.success('L\'évènement a été réactivé avec succès.');
        } catch (error) {
            toast.error('Une erreur est survenue lors de la réactivation.');
            console.error(error);
        }
    };

    return (
        <Button
            variant="outlined"
            color="success"
            startIcon={<Iconify icon="mdi:play-circle" />}
            onClick={handleReactivate}

        >
            Réactiver l'évènement
        </Button>
    );
};

export function DetailEventView({ event }: Props) {
    const customTabs = useTabs('agenda');



    const eventStats = [
        {
            title: 'Participants',
            value: 30,
            icon: `${CONFIG.assetsDir}/assets/icon-svg/user-participant.svg`,
            color: 'success' as const,
        },
        {
            title: 'Invités',
            value: 40,
            icon: `${CONFIG.assetsDir}/assets/icon-svg/user.svg`,
            color: 'warning' as const,
        },
        {
            title: 'Inscrits',
            value: 10,
            icon: `${CONFIG.assetsDir}/assets/icon-svg/user-inscrit.svg`,
            color: 'secondary' as const,
        },
        {
            title: 'Enquêtes',
            value: '7/10',
            icon: `${CONFIG.assetsDir}/assets/icon-svg/enquete.svg`,
            color: 'info' as const,
        },
    ];

    const TabContent = () => {
        const Component = TAB_COMPONENTS[customTabs.value as TabKey];
        return Component ? <Component /> : null;
    };

    return (
        <DashboardContent maxWidth="xl">
            <CustomBreadcrumbs
                heading={
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Détail évènement N°
                        <Label
                            variant="inverted"
                            sx={{
                                color: 'default',
                                opacity: 0.80,
                                fontSize: 14,
                                p: 2,
                            }}
                        >
                            {event?.matricule}
                        </Label>
                    </Box>
                }
                action={
                    <Stack direction="row" spacing={2}>
                        {event?.status !== 'suspendu' ? (  
                        <SuspendButton onStatusChange={(newStatus) => {
                            console.log('Status changed to:', newStatus);
                        }} />
                        ) : (
                            <ReactivateButton onStatusChange={(newStatus) => {
                                console.log('Status changed to:', newStatus);
                            }} />
                        )}
                        <Button

                            component={RouterLink}
                            href={paths.admin.PLANIFIER_UN_EVENEMENT.root}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:left-fill" />}
                        >
                            Retour
                        </Button>
                    </Stack>
                }
                sx={{ mb: { xs: 3, md: 2 } }}
            />
            {event?.status === 'suspendu' && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Cet évènement est suspendu. Il n'est plus accessible.
                </Alert>
            )}
            <Box sx={{ pb: 3 }}>

                <DetailEventHero
                    title={event?.name ?? ''}
                    matricule_event={event?.matricule ?? ''}
                    event_type={event?.type ?? ''}
                    location={event?.location ?? ''}
                    date={event?.date ?? ''}
                    statut={event?.status ?? ''}
                    clientName={event?.nomclient ?? ''}
                    clientAvatarUrl={event?.logoClient ?? ''}
                    coverUrl={event?.logo ?? ''}
                />
            </Box>
            <Card>
                <Stack spacing={3}>
                    {/* Stats Section */}
                    <Box sx={{ px: 3, pt: 3 }}>
                        <Grid container spacing={3}>
                            {eventStats.map((stat) => (
                                <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
                                    <DetailEventWidgetSummary
                                        title={stat.title}
                                        total={stat.value.toString()}
                                        icon={stat.icon}
                                        color={stat.color}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>


                    {/* Tabs Section */}
                    <Box sx={{ px: 3, pb: 3 }}>
                        <CustomTabs
                            value={customTabs.value}
                            onChange={customTabs.onChange}
                            sx={{ borderRadius: 1 }}
                        >
                            {TABS.map((tab) => (
                                <Tab
                                    key={tab.value}
                                    value={tab.value}
                                    label={tab.label}
                                    icon={tab.icon}
                                    iconPosition="start"
                                />
                            ))}
                        </CustomTabs>

                        {/* Contenu des onglets */}
                        <Box sx={{ mt: 3 }}>
                            <TabContent />
                        </Box>
                    </Box>
                </Stack>
            </Card>
        </DashboardContent>
    );
}