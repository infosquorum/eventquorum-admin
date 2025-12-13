import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber, fNumberFr, fPercent } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
    title?: string;
    total?: number;
    percent?: number;
    totalColor?: string;
    isPercentage?: boolean; // Nouvelle prop pour définir si le total doit être affiché en pourcentage
    chart?: {
        colors?: string[];
        categories?: string[];
        series?: number[];
        options?: ChartOptions;
    };
    sx?: SxProps<Theme>;
};

export function AdminWidgetSummary({
    title = '',
    percent = 0,
    total = 0,
    totalColor = 'inherit',
    isPercentage = false, // False par défaut
    chart = {
        categories: [],
        series: [],
    },
    sx,
    ...other
}: Props) {
    const theme = useTheme();

    const chartColors = chart?.colors ?? [theme.palette.primary.light, theme.palette.primary.main];

    const chartOptions = useChart({
        chart: { sparkline: { enabled: true } },
        colors: [chartColors[1]],
        xaxis: { categories: chart?.categories ?? [] },
        grid: {
            padding: {
                top: 6,
                left: 6,
                right: 6,
                bottom: 6,
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                colorStops: [
                    { offset: 0, color: chartColors[0], opacity: 1 },
                    { offset: 100, color: chartColors[1], opacity: 1 },
                ],
            },
        },
        tooltip: {
            y: {
                formatter: (value: number) => isPercentage ? fPercent(value) : fNumber(value),
                title: { formatter: () => '' }
            },
        },
        ...chart?.options,
    });

    const renderTrending = () => {
        return (
            <Box sx={{
                gap: 0.5,
                display: 'flex',
                alignItems: 'center',
                minHeight: '24px'
            }}>
                {percent !== 0 && percent !== undefined && (
                    <>
                        <Box
                            component="span"
                        // sx={{
                        //     width: 24,
                        //     height: 24,
                        //     display: 'flex',
                        //     borderRadius: '50%',
                        //     position: 'relative',
                        //     alignItems: 'center',
                        //     justifyContent: 'center',
                        //     bgcolor: varAlpha(theme.vars.palette.success.mainChannel, 0.16),
                        //     color: 'success.dark',
                        //     ...theme.applyStyles('dark', {
                        //         color: 'success.light',
                        //     }),
                        //     ...(percent < 0 && {
                        //         bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.16),
                        //         color: 'error.dark',
                        //         ...theme.applyStyles('dark', {
                        //             color: 'error.light',
                        //         }),
                        //     }),
                        // }}
                        >
                            {/* <Iconify
                                width={16}
                                icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
                            /> */}
                        </Box>

                        <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                            {fPercent(percent)}
                        </Box>
                    </>
                )}
            </Box>
        );
    };

    return (
        <Card
            sx={[{ p: 3, display: 'flex', alignItems: 'center', height: 165, }, ...(Array.isArray(sx) ? sx : [sx])]}
            {...other}
        >
            <Box sx={{ flexGrow: 16 }}>
                {title && <Box sx={{ typography: 'subtitle2' }}>{title}</Box>}

                {typeof total !== 'undefined' && (
                    <Box sx={{
                        my: 1.5,
                        typography: 'h3',
                        color: totalColor,
                    }}>
                        {isPercentage ? fPercent(total) : fNumberFr(total)}
                    </Box>
                )}

                {renderTrending()}
            </Box>

            {chart?.series && (
                <Chart
                    type="line"
                    series={[{ data: chart.series }]}
                    options={chartOptions}
                    sx={{ width: 100, height: 66 }}
                />
            )}
        </Card>
    );
}