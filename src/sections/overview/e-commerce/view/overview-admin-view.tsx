'use client';

import type { Event } from 'src/lib/events/types';

import { useState, useEffect, useCallback } from 'react';

import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/admin';
// ✅ IMPORT DES SERVICES
import { eventService } from 'src/lib/events/service';
import { customerService } from 'src/lib/customers/service';
import { MotivationIllustration } from 'src/assets/illustrations';

import { useMockedUser } from 'src/auth/hooks';

import { EcommerceWelcome } from '../ecommerce-welcome';
import { EventsList } from '../../admin/admin-last-five-event';
import { AdminTotalIncomes } from '../../admin/admin-total-incomes';
import { EventNumberByState } from '../../admin/admin-event-by-state';
import { AdminWidgetSummary } from '../../admin/view/admin-widget-summary';
import { _eventsList, EventsCarousel } from '../../admin/admin-event-carousel';
import { EventsYearlyAnalytics } from '../../admin/admin-event-yearly-analytics';
import { PAYMENT_DATA, PaymentMethodsList } from '../../admin/admin-sales-overview';

// ----------------------------------------------------------------------

/**
 * Interface pour les événements dans le tableau
 */
interface EventTableData {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: string;
}

/**
 * Interface pour les statistiques par statut
 */
interface EventStatusStats {
    label: string;
    value: number;
}

// ----------------------------------------------------------------------

export function OverviewAdminView() {
    const { user } = useMockedUser();
    const theme = useTheme();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📦 ÉTAT POUR LES DONNÉES ÉVÉNEMENTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const [events, setEvents] = useState<Event[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [totalEvents, setTotalEvents] = useState(0);
    const [eventsByStatus, setEventsByStatus] = useState<EventStatusStats[]>([]);
    const [lastFiveEvents, setLastFiveEvents] = useState<EventTableData[]>([]);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📦 ÉTAT POUR LES DONNÉES CLIENTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const [totalCustomers, setTotalCustomers] = useState(0);
    const [customersLoading, setCustomersLoading] = useState(true);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📖 CHARGEMENT DES ÉVÉNEMENTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const loadEventsData = useCallback(async () => {
        try {
            setEventsLoading(true);

            console.log('🔵 [Dashboard] Chargement des événements...');

            // Récupérer tous les événements (première page avec grande taille)
            const response = await eventService.getAll({
                page: 1,
                pageSize: 100, // Pour avoir tous les événements
                sortBy: 'startDate',
                sortOrder: 'Desc',
            });

            console.log('✅ [Dashboard] Événements chargés:', response.totalItems);

            setEvents(response.items);
            setTotalEvents(response.totalItems);

            // Calculer les stats par statut
            calculateStatusStats(response.items);

            // Récupérer les 5 derniers événements
            formatLastFiveEvents(response.items);

        } catch (error) {
            console.error('❌ [Dashboard] Erreur chargement événements:', error);
        } finally {
            setEventsLoading(false);
        }
    }, []);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📖 CHARGEMENT DES CLIENTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const loadCustomersData = useCallback(async () => {
        try {
            setCustomersLoading(true);

            console.log('🔵 [Dashboard] Chargement des clients...');

            // Récupérer le total des clients (on n'a besoin que du count)
            const response = await customerService.getAll({
                page: 1,
                pageSize: 1, // On veut juste le totalItems
            });

            console.log('✅ [Dashboard] Clients chargés:', response.totalItems);

            setTotalCustomers(response.totalItems);

        } catch (error) {
            console.error('❌ [Dashboard] Erreur chargement clients:', error);
        } finally {
            setCustomersLoading(false);
        }
    }, []);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🚀 CHARGEMENT AU MONTAGE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    useEffect(() => {
        // Charger les événements
        loadEventsData();
        
        // Charger les clients
        loadCustomersData();
    }, [loadEventsData, loadCustomersData]);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📊 CALCULS STATISTIQUES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * Calculer le nombre d'événements par statut
     */
    const calculateStatusStats = (eventsList: Event[]) => {
        const statusCount = {
            Finished: 0,
            NotStarted: 0,
            InProgress: 0,
            Suspended: 0,
        };

        eventsList.forEach((event) => {
            statusCount[event.status] = (statusCount[event.status] || 0) + 1;
        });

        const stats: EventStatusStats[] = [
            { label: 'Terminé', value: statusCount.Finished },
            { label: 'Non démarré', value: statusCount.NotStarted },
            { label: 'En cours', value: statusCount.InProgress },
            // On peut ajouter Suspendu si nécessaire
            // { label: 'Suspendu', value: statusCount.Suspended },
        ];

        setEventsByStatus(stats);

        console.log('📊 [Dashboard] Stats par statut:', stats);
    };

    /**
     * Formater les 5 derniers événements pour le tableau
     */
    const formatLastFiveEvents = (eventsList: Event[]) => {
        const lastFive = eventsList.slice(0, 5).map((event) => ({
            id: event.id,
            title: event.name,
            startDate: formatDate(event.startDate),
            endDate: formatDate(event.endDate),
            status: eventService.getStatusLabel(event),
        }));

        setLastFiveEvents(lastFive);

        console.log('📋 [Dashboard] 5 derniers événements:', lastFive.length);
    };

    /**
     * Formater une date au format FR
     */
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return (
        <DashboardContent maxWidth="xl">
            <Grid container spacing={3}>
                {/* ═════════════════════════════════════════════════════════════ */}
                {/* SECTION 1 : WELCOME CARD + CAROUSEL */}
                {/* ═════════════════════════════════════════════════════════════ */}

                <Grid size={{ xs: 12, md: 8 }}>
                    <EcommerceWelcome
                        title={`Bienvenue 🎉  \n ${user?.displayName}`}
                        description="Vous êtes connecté(e) sur l'espace Administrateur..."
                        img={<MotivationIllustration hideBackground />}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <EventsCarousel list={_eventsList} />
                </Grid>

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* SECTION 2 : WIDGETS STATISTIQUES */}
                {/* ═════════════════════════════════════════════════════════════ */}

                {/* WIDGET CLIENTS - ✅ DONNÉES RÉELLES */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <AdminWidgetSummary
                        title="Clients"
                        total={totalCustomers}
                        chart={{
                            categories: ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
                            series: [22, 8, 35, 50, 82, 84, 77, 12], // 🔜 Mock data (à connecter plus tard)
                        }}
                    />
                </Grid>

                {/* WIDGET ÉVÉNEMENTS - ✅ DONNÉES RÉELLES */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <AdminWidgetSummary
                        title="Événements"
                        total={totalEvents}
                        chart={{
                            colors: [theme.palette.warning.light, theme.palette.warning.main],
                            categories: ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
                            series: [56, 47, 40, 62, 73, 30, 23, 54], // 🔜 Mock data (à connecter plus tard)
                        }}
                    />
                </Grid>

                {/* WIDGET INVITÉS - 🔜 Mock data */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <AdminWidgetSummary
                        title="Invités (moy)"
                        percent={90}
                        total={1753987}
                    />
                </Grid>

                {/* WIDGET PARTICIPANTS - 🔜 Mock data */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <AdminWidgetSummary
                        title="Participants (moy)"
                        percent={60}
                        total={547090}
                        totalColor={theme.palette.primary.main}
                    />
                </Grid>

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* SECTION 3 : ÉVÉNEMENTS PAR STATUT + ANALYTICS */}
                {/* ═════════════════════════════════════════════════════════════ */}

                {/* ÉVÉNEMENTS PAR STATUT - ✅ DONNÉES RÉELLES */}
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <EventNumberByState
                        title="Nbre d'événements par statut"
                        total={totalEvents}
                        chart={{
                            series: eventsByStatus,
                        }}
                    />
                </Grid>

                {/* ANALYTICS ANNUELLES - 🔜 Mock data */}
                <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                    <EventsYearlyAnalytics
                        title="Événements annuels"
                        subheader="(+5%) de participation par rapport à l'année dernière"
                        chart={{
                            categories: [
                                'Jan',
                                'Fév',
                                'Mars',
                                'Avr',
                                'Mai',
                                'Juin',
                                'Juil',
                                'Août',
                                'Sept',
                                'Oct',
                                'Nov',
                                'Déc',
                            ],
                            series: [
                                {
                                    name: '2023',
                                    data: [
                                        {
                                            name: 'Evénements',
                                            data: [8, 10, 12, 15, 18, 22, 25, 28, 30, 40, 15, 12],
                                            isDisplayed: true,
                                        },
                                        {
                                            name: 'Taux de participation',
                                            data: [70, 75, 80, 85, 88, 92, 95, 96, 98, 85, 80, 75],
                                            isDisplayed: true,
                                        },
                                        {
                                            name: 'Participants (moy)',
                                            data: [60, 65, 70, 75, 80, 85, 90, 95, 150, 85, 75, 70],
                                            isDisplayed: false,
                                        },
                                        {
                                            name: 'Invités (moy)',
                                            data: [30, 35, 40, 45, 50, 55, 60, 65, 70, 55, 45, 40],
                                            isDisplayed: false,
                                        },
                                    ],
                                },
                                {
                                    name: '2022',
                                    data: [
                                        {
                                            name: 'Evénements',
                                            data: [5, 8, 6, 10, 12, 15, 18, 20, 25, 12, 8, 40],
                                            isDisplayed: true,
                                        },
                                        {
                                            name: 'Taux de participation',
                                            data: [65, 70, 75, 80, 85, 90, 88, 92, 95, 78, 72, 70],
                                            isDisplayed: true,
                                        },
                                        {
                                            name: 'Participants (moy)',
                                            data: [55, 60, 65, 70, 75, 80, 83, 88, 90, 75, 65, 60],
                                            isDisplayed: true,
                                        },
                                        {
                                            name: 'Invités (moy)',
                                            data: [25, 30, 35, 40, 45, 50, 48, 52, 55, 40, 32, 30],
                                            isDisplayed: true,
                                        },
                                    ],
                                },
                                {
                                    name: '2021',
                                    data: [
                                        {
                                            name: 'Evénements',
                                            data: [3, 5, 4, 8, 10, 12, 15, 40, 20, 10, 6, 8],
                                            isDisplayed: true,
                                        },
                                        {
                                            name: 'Taux de participation',
                                            data: [60, 65, 70, 75, 80, 85, 82, 88, 90, 75, 68, 65],
                                            isDisplayed: true,
                                        },
                                        {
                                            name: 'Participants (moy)',
                                            data: [50, 55, 60, 65, 70, 75, 78, 82, 85, 70, 60, 55],
                                            isDisplayed: true,
                                        },
                                        {
                                            name: 'Invités (moy)',
                                            data: [20, 25, 30, 35, 40, 45, 42, 48, 50, 35, 28, 25],
                                            isDisplayed: true,
                                        },
                                    ],
                                },
                            ],
                        }}
                    />
                </Grid>

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* SECTION 4 : BILAN FINANCIER + MOYENS DE PAIEMENT */}
                {/* ═════════════════════════════════════════════════════════════ */}

                {/* BILAN FINANCIER - 🔜 Mock data */}
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <AdminTotalIncomes
                        title="Bilan financier"
                        total={15650000}
                        chart={{
                            categories: [
                                'Jan',
                                'Fév',
                                'Mars',
                                'Avr',
                                'Mai',
                                'Juin',
                                'Juil',
                                'Août',
                                'Sept',
                            ],
                            series: [
                                {
                                    data: [
                                        120000, 150000, 180000, 220000, 250000, 300000, 280000, 260000,
                                        310000,
                                    ],
                                },
                            ],
                        }}
                    />
                </Grid>

                {/* MOYENS DE PAIEMENT - 🔜 Mock data */}
                <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                    <PaymentMethodsList title="Les moyens de paiement" data={PAYMENT_DATA} />
                </Grid>

                {/* ═════════════════════════════════════════════════════════════ */}
                {/* SECTION 5 : LISTE DES 5 DERNIERS ÉVÉNEMENTS */}
                {/* ═════════════════════════════════════════════════════════════ */}

                <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                    <EventsList
                        title="Liste des 5 derniers événements"
                        tableData={lastFiveEvents}
                        headCells={[
                            { id: 'title', label: "Nom d'événement" },
                            { id: 'startDate', label: 'Date de début' },
                            { id: 'endDate', label: 'Date de fin' },
                            { id: 'status', label: 'Statut' },
                        ]}
                    />
                </Grid>
            </Grid>
        </DashboardContent>
    );
}