/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * VUE DÉTAIL ÉVÉNEMENT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Composant principal pour afficher les détails d'un événement.
 * 
 * Données réelles (depuis API) :
 * - Informations événement (hero section)
 * - Statut et actions (suspendre/réactiver)
 * 
 * Données mockées (pas encore dans la BD) :
 * - Statistiques (participants, invités, inscrits, enquêtes)
 * - Agenda
 * - Liste des accès
 * - Photothèque
 * - Bilan financier
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

'use client';

import React, { useState } from 'react';
import { useTabs } from 'minimal-shared/hooks';

import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { 
  Box, 
  Button, 
  Card, 
  Tab, 
  Typography, 
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle 
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/admin';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomTabs } from 'src/components/custom-tabs';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import type { IEventItem } from 'src/types/event';

import { DetailEventHero } from './detailevent-hero-view';
import { EventTabComponents } from '../detail-evenement-tabs';
import { DetailEventWidgetSummary } from '../detailevent-widget-summary';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type Props = {
  event?: IEventItem;
  onRefresh?: () => void; // Callback pour recharger après suspend/unsuspend
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📋 CONFIGURATION DES ONGLETS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TABS = [
  { 
    value: 'agenda', 
    icon: <Iconify width={24} icon="solar:clipboard-list-bold" />, 
    label: 'Agenda' 
  },
  { 
    value: 'acces_list', 
    icon: <Iconify width={24} icon="solar:shield-user-bold" />, 
    label: 'Liste des accès' 
  },
  { 
    value: 'phototheque', 
    icon: <Iconify width={24} icon="solar:camera-bold" />, 
    label: 'Photothèque' 
  },
  { 
    value: 'bilan', 
    icon: <Iconify width={24} icon="solar:chart-2-bold" />, 
    label: 'Bilan Financier' 
  },
];

const TAB_COMPONENTS = {
  agenda: EventTabComponents.AgendaTab,
  acces_list: EventTabComponents.AccessListTab,
  phototheque: EventTabComponents.PhotothequeTab,
  bilan: EventTabComponents.bilanFinancierTab,
} as const;

type TabKey = keyof typeof TAB_COMPONENTS;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔔 COMPOSANT : DIALOGUE DE CONFIRMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SuspendDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Dialogue de confirmation pour suspendre un événement
 */
const SuspendConfirmDialog = ({ open, onClose, onConfirm }: SuspendDialogProps) => (
  <Dialog open={open} onClose={onClose}>
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔘 COMPOSANT : BOUTON SUSPENDRE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SuspendButtonProps {
  eventId: string;
  onSuccess: () => void;
}

/**
 * Bouton pour suspendre un événement
 * 
 * TODO Backend : Implémenter l'endpoint PUT /api/events/{id}/suspend
 */
const SuspendButton = ({ eventId, onSuccess }: SuspendButtonProps) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleSuspendEvent = async () => {
    try {
      // TODO: Décommenter quand le backend sera prêt
      // await eventService.suspend(eventId);
      
      // ⚠️ Pour l'instant, simuler le succès
      console.log('🔴 Suspension événement:', eventId);
      
      toast.success('L\'évènement a été suspendu avec succès. Il n\'est plus accessible.');
      setOpenDialog(false);
      
      // Recharger les données
      onSuccess();
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suspension de l\'évènement.');
      console.error('❌ Erreur suspension:', error);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        startIcon={<Iconify icon="mdi:pause-circle" />}
        onClick={() => setOpenDialog(true)}
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔘 COMPOSANT : BOUTON RÉACTIVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ReactivateButtonProps {
  eventId: string;
  onSuccess: () => void;
}

/**
 * Bouton pour réactiver un événement suspendu
 * 
 * TODO Backend : Implémenter l'endpoint PUT /api/events/{id}/reactivate
 */
const ReactivateButton = ({ eventId, onSuccess }: ReactivateButtonProps) => {
  const handleReactivate = async () => {
    try {
      // TODO: Décommenter quand le backend sera prêt
      // await eventService.reactivate(eventId);
      
      // ⚠️ Pour l'instant, simuler le succès
      console.log('🟢 Réactivation événement:', eventId);
      
      toast.success('L\'évènement a été réactivé avec succès.');
      
      // Recharger les données
      onSuccess();
    } catch (error) {
      toast.error('Une erreur est survenue lors de la réactivation.');
      console.error('❌ Erreur réactivation:', error);
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📄 COMPOSANT PRINCIPAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function DetailEventView({ event, onRefresh }: Props) {
  const customTabs = useTabs('agenda');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📊 STATISTIQUES (DONNÉES MOCKÉES)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * ⚠️ IMPORTANT : Ces statistiques sont des données mockées
   * car elles ne sont pas encore disponibles dans la base de données.
   * 
   * TODO Backend : Implémenter les endpoints pour :
   * - GET /api/events/{id}/participants/count
   * - GET /api/events/{id}/guests/count
   * - GET /api/events/{id}/registrations/count
   * - GET /api/events/{id}/surveys/stats
   */
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

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎭 RENDU DU CONTENU DES ONGLETS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const TabContent = () => {
    const Component = TAB_COMPONENTS[customTabs.value as TabKey];
    return Component ? <Component /> : null;
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎨 RENDU
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <DashboardContent maxWidth="xl">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BREADCRUMBS & ACTIONS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
              {event?.matricule || 'N/A'}
            </Label>
          </Box>
        }
        action={
          <Stack direction="row" spacing={2}>
            {/* Bouton Suspendre/Réactiver */}
            {event?.status !== 'suspendu' ? (
              <SuspendButton 
                eventId={event?.id || ''} 
                onSuccess={() => onRefresh?.()} 
              />
            ) : (
              <ReactivateButton 
                eventId={event?.id || ''} 
                onSuccess={() => onRefresh?.()} 
              />
            )}
            
            {/* Bouton Retour */}
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ALERTE SI ÉVÉNEMENT SUSPENDU
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {event?.status === 'suspendu' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Cet évènement est suspendu. Il n'est plus accessible.
        </Alert>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO SECTION (DONNÉES RÉELLES)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CONTENU PRINCIPAL
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Card>
        <Stack spacing={3}>
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              STATISTIQUES (DONNÉES MOCKÉES)
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <Box sx={{ px: 3, pt: 3 }}>
            {/* Alerte pour indiquer que les stats sont mockées */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Note :</strong> Les statistiques ci-dessous sont des données d'exemple. 
                Elles seront remplacées par les vraies données une fois les fonctionnalités 
                participants/invités/enquêtes implémentées.
              </Typography>
            </Alert>

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

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              ONGLETS (DONNÉES MOCKÉES)
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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