import type { CardProps } from '@mui/material/Card';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import { fFCFA, fNumber, fPercent } from 'src/utils/format-number';

// Types
type PaymentData = {
    label: string;
    value: number;     // pourcentage pour la barre de progression
    totalAmount: number; // montant total
    color: string;
    icon: string;
};

type Props = CardProps & {
    title?: string;
    subheader?: string;
    data: PaymentData[];
};

// Calcul du total et des pourcentages
const calculatePercentages = (amounts: number[]): number[] => {
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    return amounts.map(amount => (amount / total) * 100);
};

// Données avec pourcentages calculés
const TOTAL_AMOUNT = 6259000; // Somme de tous les montants

export const PAYMENT_DATA: PaymentData[] = [
    {
        label: 'Wave',
        totalAmount: 3740000,
        value: (3740000 / TOTAL_AMOUNT) * 100,
        color: '#00BCD4',
        icon: '/assets/icons/payment/wave.png'
    },
    {
        label: 'Orange Money',
        totalAmount: 1519000,
        value: (1519000 / TOTAL_AMOUNT) * 100,
        color: '#ff7900',
        icon: '/assets/icons/payment/orange.svg'
    },
    {
        label: 'MTN Mobile Money',
        totalAmount: 500000,
        value: (500000 / TOTAL_AMOUNT) * 100,
        color: '#FFC107',
        icon: '/assets/icons/payment/MTN.png'
    },
    {
        label: 'Moov Money',
        totalAmount: 300000,
        value: (300000 / TOTAL_AMOUNT) * 100,
        color: '#1a1aff',
        icon: '/assets/icons/payment/moovci_good.png'
    },
    {
        label: 'Carte bancaire',
        totalAmount: 200000,
        value: (200000 / TOTAL_AMOUNT) * 100,
        color: '#9C27B0',
        icon: '/assets/icons/payment/carte.png'
    }
];

export function PaymentMethodsList({ title = "Les moyens de paiement", data = PAYMENT_DATA, sx, ...other }: Props) {
    return (
        <Card sx={sx} {...other}>
            <CardHeader title={title} />

            <Box
                sx={{
                    gap: 4,
                    px: 3,
                    py: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {data.map((method) => (
                    <PaymentMethodItem
                        key={method.label}
                        progress={method}
                    />
                ))}
            </Box>
        </Card>
    );
}

type ItemProps = {
    progress: PaymentData;
};

function PaymentMethodItem({ progress }: ItemProps) {
    return (
        <div>
            <Box
                sx={{
                    mb: 1,
                    gap: 2,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Box
                    component="img"
                    src={progress.icon}
                    sx={{ width: 32, height: 32 }}
                />

                <Box component="span" sx={{ flexGrow: 1, typography: 'subtitle2' }}>
                    {progress.label}
                </Box>

                <Box component="span">
                    {fFCFA(progress.totalAmount)}
                    {/* {fNumber(progress.totalAmount)} FCFA */}
                </Box>

                <Box
                    component="span"
                    sx={{
                        typography: 'body2',
                        color: 'text.secondary',
                        ml: 1
                    }}
                >
                    ({fPercent(progress.value)})
                </Box>
            </Box>

            <LinearProgress
                variant="determinate"
                value={progress.value}
                sx={{
                    height: 8,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                        bgcolor: progress.color,
                    },
                }}
            />
        </div>
    );
}