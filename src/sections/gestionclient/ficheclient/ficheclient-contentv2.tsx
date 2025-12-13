import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";

import { RouterLink } from 'src/routes/components';
import { usePathname, useSearchParams } from 'src/routes/hooks';

import { DashboardContent } from "src/layouts/admin";
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';

import { Iconify } from "src/components/iconify";

import { ProfileCover } from "src/sections/user/profile-cover";

import { IClientItem } from "src/types/client";

import { FicheClientHome } from "./tabs/ficheclient-home";
import { FicheClientOrganisateur } from "./tabs/ficheclient-organisateur";
import { EventData, FicheClientEvenement } from "./tabs/ficheclient-evenement";


// ----------------------------------------------------------------------

const NAV_ITEMS = [
    {
        value: '',
        label: 'Informations',
        icon: <Iconify width={24} icon="solar:user-id-bold" />,
    },
    {
        value: 'evenement',
        label: 'Evenements',
        icon: <Iconify width={24} icon="solar:calendar-minimalistic-bold-duotone" />,
    },
    {
        value: 'organisateur',
        label: 'Organisateurs',
        icon: <Iconify width={24} icon="solar:users-group-rounded-bold" />,
    },
];

// ----------------------------------------------------------------------

const sampleEventData: EventData[] = [
    {
      id: 1,
      name: 'Annual Meetings 2024',
      date: '10/01/2024',
      participants: 50,
      inscriptions: 80,
      invites: 90,
      amountReceived: 2000,
      survey: '5/7',
      paymentMethods: [
        { name: 'Wave', amount: 59.8, value: 3740000, color: '#00c1d4' },
        { name: 'Orange Money', amount: 24.3, value: 1519000, color: '#FF7900' },
        { name: 'MTN Mobile Money', amount: 8.0, value: 500000, color: '#FFC107' },
        { name: 'Moov Money', amount: 4.8, value: 300000, color: '#0066ff' },
        { name: 'Carte bancaire', amount: 3.2, value: 200000, color: '#9c27b0' }
      ],
      activities: [
        { activity: 'Workshop', inscrits: '50', invites: '80', participants: '50', montant: '2 000 000', statut: 'Terminer' },
        { activity: 'Workshop cyber', inscrits: '70', invites: '80', participants: '45', montant: '---', statut: 'En cours' },
        { activity: 'Cyber', inscrits: '70', invites: '70', participants: '50', montant: '300 000', statut: 'Non démarrer' }
      ]
    },
    {
      id: 2,
      name: 'Tech Summit 2024',
      date: '15/03/2024',
      participants: 120,
      inscriptions: 150,
      invites: 180,
      amountReceived: 4500,
      survey: '8/10',
      paymentMethods: [
        { name: 'Wave', amount: 45.5, value: 4550000, color: '#00c1d4' },
        { name: 'Orange Money', amount: 30.2, value: 3020000, color: '#FF7900' },
        { name: 'MTN Mobile Money', amount: 15.3, value: 1530000, color: '#FFC107' },
        { name: 'Moov Money', amount: 5.8, value: 580000, color: '#0066ff' },
        { name: 'Carte bancaire', amount: 3.2, value: 320000, color: '#9c27b0' }

      ],
      activities: [
        { activity: 'Conférence IA', inscrits: '100', invites: '120', participants: '95', montant: '3 500 000', statut: 'Terminer' },
        { activity: 'Hackathon', inscrits: '50', invites: '60', participants: '45', montant: '1 500 000', statut: 'Terminer' },
        { activity: 'Workshop Cloud', inscrits: '80', invites: '90', participants: '0', montant: '---', statut: 'Non démarrer' }
      ]
    },
    {
      id: 3,
      name: 'Formation Cybersécurité',
      date: '05/04/2024',
      participants: 35,
      inscriptions: 40,
      invites: 45,
      amountReceived: 1800,
      survey: '4/5',
      paymentMethods: [
        { name: 'Wave', amount: 52.0, value: 1560000, color: '#00c1d4' },
        { name: 'Orange Money', amount: 28.5, value: 855000, color: '#FF7900' },
        { name: 'MTN Mobile Money', amount: 12.5, value: 375000, color: '#FFC107' },
        { name: 'Moov Money', amount: 4.0, value: 120000, color: '#0066ff' },
        { name: 'Carte bancaire', amount: 3.0, value: 90000, color: '#9c27b0' }

      ],
      activities: [
        { activity: 'Sécurité réseau', inscrits: '35', invites: '40', participants: '32', montant: '1 600 000', statut: 'Terminer' },
        { activity: 'Ethical Hacking', inscrits: '30', invites: '35', participants: '28', montant: '1 400 000', statut: 'En cours' },
        { activity: 'Cryptographie', inscrits: '25', invites: '30', participants: '0', montant: '---', statut: 'Non démarrer' }
      ]
    }
  ];

// ----------------------------------------------------------------------


type Props = {
    client?: IClientItem;
};

const TAB_PARAM = 'tab';

export function FicheClientContentV2({ client }: Props) {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedTab = searchParams.get(TAB_PARAM) ?? '';

    // const { user } = useMockedUser();

    const createRedirectPath = (currentPath: string, query: string) => {
        const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
        return query ? `${currentPath}?${queryString}` : currentPath;
    };

    return (
        <DashboardContent>
            {/* maxWidth={'xl'} */}
            <Card sx={{ mb: 3, height: 290 }}>
                <ProfileCover
                    role={client?.isMoralePerson ? 'Type de Client : Personne morale' : 'Type de Client : Personne physique'}
                    name={client?.company_name ?? ''}
                    avatarUrl={(client?.isMoralePerson ? client?.logo : client?.personLogo) ?? ''}
                    coverUrl={_userAbout.coverUrl}
                />

                <Box
                    sx={{
                        width: 1,
                        bottom: 0,
                        zIndex: 9,
                        px: { md: 3 },
                        display: 'flex',
                        position: 'absolute',
                        bgcolor: 'background.paper',
                        justifyContent: { xs: 'center', md: 'flex-end' },
                    }}
                >
                    <Tabs value={selectedTab}>
                        {NAV_ITEMS.map((tab) => (
                            <Tab
                                component={RouterLink}
                                key={tab.value}
                                value={tab.value}
                                icon={tab.icon}
                                label={tab.label}
                                href={createRedirectPath(pathname, tab.value)}
                            />
                        ))}
                    </Tabs>
                </Box>
            </Card>
            {selectedTab === '' && <FicheClientHome client={client} />}

            {selectedTab === 'evenement' && <FicheClientEvenement eventData={sampleEventData} />}

            {selectedTab === 'organisateur' && <FicheClientOrganisateur  />}

        </DashboardContent>
    )
}