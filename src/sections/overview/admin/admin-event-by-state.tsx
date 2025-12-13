import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import { varAlpha } from 'minimal-shared/utils';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
    title?: string;
    subheader?: string;
    total: number;
    chart: {
        colors?: string[][];
        series: {
            // label: 'En cours' | 'Non-démarrer' | 'Terminer';
            label: string;
            value: number;
        }[];
        options?: ChartOptions;
    };
};

// const colorMapping: Record<'En cours' | 'Non-démarrer' | 'Terminer', string> = {
//     'En cours': '#4caf50', // Vert
//     'Non-démarrer': '#ff9800', // Orange
//     'Terminer': '#f44336', // Rouge
// };

export function EventNumberByState({ title, subheader, total, chart, sx, ...other }: Props) {
    const theme = useTheme();

    const chartSeries = chart.series.map((item) => item.value);
    // const chartSeriesLabels = chart.series.map((item) => item.label);

    const chartColors = chart.colors ?? [
        [theme.palette.success.light, theme.palette.success.main],
        [hexAlpha(theme.palette.error.light, 0.8), hexAlpha(theme.palette.error.main, 0.8)],
        [hexAlpha(theme.palette.warning.light, 0.8), hexAlpha(theme.palette.warning.main, 0.8)],
    ];

    // const chartColors = chartSeriesLabels ?? [
    //     theme.palette.primary.light,
    //     theme.palette.warning.light,
    //     theme.palette.error.light,
    // ]

    const chartOptions = useChart({
        chart: { sparkline: { enabled: true } },
        colors: chartColors.map((color) => color[1]),
        labels: chart.series.map((item) => item.label),
        stroke: { width: 0 },
        fill: {
            type: 'gradient',
            gradient: {
                colorStops: chartColors.map((color) => [
                    { offset: 0, color: color[0], opacity: 1 },
                    { offset: 100, color: color[1], opacity: 1 },
                ]),
            },
        },
        grid: { padding: { top: -40, bottom: -40 } },
        plotOptions: {
            radialBar: {
                hollow: { margin: 10, size: '32%' },
                track: { margin: 10, background: varAlpha(theme.vars.palette.grey['500Channel'], 0.08) },
                dataLabels: {
                    total: { formatter: () => fNumber(total) },
                    value: { offsetY: 2, fontSize: theme.typography.h5.fontSize as string },
                    name: { offsetY: -10 },
                },
            },
        },
        ...chart.options,
    });

    return (
        <Card sx={sx} {...other}>
            <CardHeader title={title} subheader={subheader} />

            <Chart
                type="radialBar"
                series={chartSeries}
                options={chartOptions}
                slotProps={{ loading: { p: 4 } }}
                sx={{
                    my: 1.5,
                    mx: 'auto',
                    width: { xs: 300, xl: 320 },
                    height: { xs: 340, xl: 370 },
                }}
            />

            <Divider sx={{ borderStyle: 'dashed' }} />

            <ChartLegends
                labels={chartOptions?.labels}
                colors={chartOptions?.colors}
                sx={{ p: 3, justifyContent: 'center' }}
            />
        </Card>
    );
}
