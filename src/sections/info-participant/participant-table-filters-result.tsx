import type { IParticipantTableFilters } from 'src/types/participant';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  onResetPage: () => void;
  filters: UseSetStateReturn<IParticipantTableFilters>;
  activeTab: string;
};

export function ParticipantTableFiltersResult({ 
  filters, 
  onResetPage, 
  totalResults, 
  activeTab,
  sx 
}: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ name: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: 'all' });
  }, [onResetPage, updateFilters]);

  const handleRemoveActivity = useCallback(() => {
    onResetPage();
    updateFilters({ activity: 'all' });
  }, [onResetPage, updateFilters]);

  const handleRemoveConnectionStatus = useCallback(() => {
    onResetPage();
    updateFilters({ connectionStatus: 'all' });
  }, [onResetPage, updateFilters]);

  const handleRemovePurchaseStatus = useCallback(() => {
    onResetPage();
    updateFilters({ purchaseStatus: 'all' });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  // Fonction pour obtenir le label du statut selon l'onglet actif
  const getStatusLabel = (status: string) => {
    if (status === 'all' || !status) return '';
    
    switch (activeTab) {
      case 'demandes':
        switch (status) {
          case 'en_attente': return 'En attente';
          case 'acceptee': return 'Acceptée';
          case 'rejetee': return 'Rejetée';
          case 'annulee': return 'Annulée';
          default: return status;
        }
      case 'invites':
        switch (status) {
          case 'invite': return 'Invité';
          case 'confirme': return 'Confirmé';
          case 'desiste': return 'Désisté';
          case 'connecte': return 'Connecté';
          case 'non_connecte': return 'Non connecté';
          default: return status;
        }
      case 'participants':
        switch (status) {
          case 'present': return 'Présent';
          case 'absent': return 'Absent';
          case 'en_presentiel': return 'En présentiel';
          case 'en_ligne': return 'En ligne';
          case 'partiel': return 'Participation partielle';
          default: return status;
        }
      default:
        return status;
    }
  };

  // Fonction pour obtenir le label d'activité
  const getActivityLabel = (activity: string) => {
    if (activity === 'all' || !activity) return '';
    
    // Vous pouvez adapter ces labels selon vos activités réelles
    switch (activity) {
      case 'conference': return 'Conférence';
      case 'atelier': return 'Atelier';
      case 'networking': return 'Networking';
      case 'presentation': return 'Présentation';
      default: return activity;
    }
  };

  // Fonction pour obtenir le label de statut de connexion
  const getConnectionLabel = (status: string) => {
    if (status === 'all' || !status) return '';
    
    switch (status) {
      case 'connecte': return 'Connectés';
      case 'non_connecte': return 'Non connectés';
      case 'premiere_connexion': return 'Première connexion effectuée';
      case 'jamais_connecte': return 'Jamais connecté';
      default: return status;
    }
  };

  // Fonction pour obtenir le label de statut d'achat/première connexion
  const getPurchaseLabel = (status: string) => {
    if (status === 'all' || !status) return '';
    
    switch (status) {
      case 'achat_effectue': return 'Achat effectué';
      case 'pas_achat': return 'Pas d\'achat effectué';
      case 'premiere_connexion_oui': return 'Première connexion effectuée';
      case 'premiere_connexion_non': return 'Première connexion non effectuée';
      default: return status;
    }
  };

  // Fonction pour obtenir le texte du résumé selon l'onglet
  const getResultsLabel = () => {
    const count = totalResults || 0;
    switch (activeTab) {
      case 'demandes':
        return count === 0 ? 'Aucune demande trouvée' : 
               count === 1 ? '1 demande trouvée' : `${count} demandes trouvées`;
      case 'invites':
        return count === 0 ? 'Aucun invité trouvé' : 
               count === 1 ? '1 invité trouvé' : `${count} invités trouvés`;
      case 'participants':
        return count === 0 ? 'Aucun participant trouvé' : 
               count === 1 ? '1 participant trouvé' : `${count} participants trouvés`;
      default:
        return count === 0 ? 'Aucun résultat trouvé' : 
               count === 1 ? '1 résultat trouvé' : `${count} résultats trouvés`;
    }
  };

  return (
    <FiltersResult 
      totalResults={totalResults} 
      onReset={handleReset} 
      sx={sx}
    >
      {/* Résumé des résultats */}
      <FiltersBlock label="" isShow>
        {getResultsLabel()}
      </FiltersBlock>
      {/* Filtre par mot-clé (présent dans tous les onglets) */}
      <FiltersBlock label="Recherche:" isShow={!!currentFilters.name}>
        <Chip 
          {...chipProps} 
          label={currentFilters.name} 
          onDelete={handleRemoveKeyword} 
        />
      </FiltersBlock>

      {/* Filtre par statut (présent dans tous les onglets) */}
      <FiltersBlock 
        label="Statut:" 
        isShow={!!(currentFilters.status && currentFilters.status !== 'all')}
      >
        <Chip 
          {...chipProps} 
          label={getStatusLabel(currentFilters.status || '')} 
          onDelete={handleRemoveStatus} 
        />
      </FiltersBlock>

      {/* Filtre par activité (présent dans les onglets invités et participants) */}
      {(activeTab === 'invites' || activeTab === 'participants') && (
        <FiltersBlock 
          label="Activité:" 
          isShow={!!(currentFilters.activity && currentFilters.activity !== 'all')}
        >
          <Chip 
            {...chipProps} 
            label={getActivityLabel(currentFilters.activity || '')} 
            onDelete={handleRemoveActivity} 
          />
        </FiltersBlock>
      )}

      {/* Filtre par statut de connexion (présent uniquement dans l'onglet invités) */}
      {activeTab === 'invites' && (
        <FiltersBlock 
          label="Connexion:" 
          isShow={!!(currentFilters.connectionStatus && currentFilters.connectionStatus !== 'all')}
        >
          <Chip 
            {...chipProps} 
            label={getConnectionLabel(currentFilters.connectionStatus || '')} 
            onDelete={handleRemoveConnectionStatus} 
          />
        </FiltersBlock>
      )}

      {/* Filtre par statut d'achat/première connexion (présent uniquement dans l'onglet invités) */}
      {activeTab === 'invites' && (
        <FiltersBlock 
          label="Achat/Première connexion:" 
          isShow={!!(currentFilters.purchaseStatus && currentFilters.purchaseStatus !== 'all')}
        >
          <Chip 
            {...chipProps} 
            label={getPurchaseLabel(currentFilters.purchaseStatus || '')} 
            onDelete={handleRemovePurchaseStatus} 
          />
        </FiltersBlock>
      )}
    </FiltersResult>
  );
}