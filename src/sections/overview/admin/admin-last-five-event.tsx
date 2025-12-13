import type { CardProps } from '@mui/material/Card';
import type { TableHeadCellProps } from 'src/components/table';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

// Types
type EventData = {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: string;
};

type Props = CardProps & {
    title?: string;
    subheader?: string;
    headCells: TableHeadCellProps[];
    tableData: EventData[];
};

// Données mockées
export const _lastFiveEvents = [
    {
        id: '1',
        title: 'SARA 2025',
        startDate: '21/10/2025',
        endDate: '28/10/2025',
        status: 'Non demarré'
    },
    {
        id: '2',
        title: 'FORUM TOTAL',
        startDate: '30/12/2024',
        endDate: '31/12/2024',
        status: 'En cours'
    },
    {
        id: '3',
        title: 'SALON DANCE',
        startDate: '25/11/2024',
        endDate: '11/12/2024',
        status: 'Terminé'
    },
    {
        id: '4',
        title: 'CONFERENCE',
        startDate: '02/10/2024',
        endDate: '07/10/2024',
        status: 'Non demarré'
    },
    {
        id: '5',
        title: 'FORMATION CHILD',
        startDate: '01/09/2024',
        endDate: '06/09/2024',
        status: 'Terminé'
    }
];

export function EventsList({ title, subheader, tableData, headCells, sx, ...other }: Props) {
    return (
        <Card sx={sx} {...other}>
            <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
            <Scrollbar>
                <Table>
                    <TableHeadCustom
                        headCells={[
                            { id: 'title', label: "Nom d'évènement" },
                            { id: 'startDate', label: 'Date de début' },
                            { id: 'endDate', label: 'Date de fin' },
                            { id: 'status', label: 'Statut' },
                        ]}
                    />
                    <TableBody>
                        {tableData.map((row) => (
                            <RowItem key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </Scrollbar>
        </Card>
    );
}

type RowItemProps = {
    row: EventData;
};

function RowItem({ row }: RowItemProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'En cours':
                return 'warning';
            case 'Non demarré':
                return 'error';
            case 'Terminé':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <TableRow>
            <TableCell>{row.title}</TableCell>
            <TableCell>{row.startDate}</TableCell>
            <TableCell>{row.endDate}</TableCell>
            <TableCell>
                <Label
                    variant="soft"
                    color={getStatusColor(row.status)}
                >
                    {row.status}
                </Label>
            </TableCell>
        </TableRow>
    );
}