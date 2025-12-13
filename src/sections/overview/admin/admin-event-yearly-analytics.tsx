import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import { fNumber } from 'src/utils/format-number';
import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';
import { ChartLegendsCards } from 'src/components/chart/components/chart-legends-with-card';

interface SeriesData {
    name: string;
    data: number[];
    isDisplayed: boolean;
}

interface YearData {
    name: string;
    data: SeriesData[];
}

interface ChartData {
    categories: string[];
    series: YearData[];
}

interface Props {
    title?: string;
    subheader?: string;
    chart: ChartData;
    sx?: object;
}

export function EventsYearlyAnalytics({ title, subheader, chart, sx, ...other }: Props) {
    const theme = useTheme();
    const [selectedYear, setSelectedYear] = useState(chart.series[0].name);
    const [selectedMetric, setSelectedMetric] = useState<number>(0);

    const chartColors = [
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.error.main,
    ];

    const metrics = [
        "Evènements",
        "Taux de participation",
        "Participants (moy)",
        "Invités (moy)"
    ];

    const currentSeries = chart.series.find((i) => i.name === selectedYear);

    const handleChangeYear = useCallback((newValue: string) => {
        setSelectedYear(newValue);
    }, []);

    const handleChangeMetric = useCallback((index: number) => {
        setSelectedMetric(index);
    }, []);

    const getFormatter = (metricIndex: number) => {
        return (value: number) => {
            if (metricIndex === 1) return `${value}%`;
            return fNumber(value);
        };
    };

    // Création des séries complètes pour les tooltips
    const allSeriesData = currentSeries?.data.map((series, index) => ({
        name: series.name,
        data: series.data,
        formatter: getFormatter(index)
    })) ?? [];

    const chartOptions = useChart({
        colors: [chartColors[selectedMetric]],
        xaxis: {
            categories: chart.categories,
        },
        yaxis: {
            title: {
                text: metrics[selectedMetric],
            },
            labels: {
                formatter: getFormatter(selectedMetric)
            },
            min: 0,
            max: selectedMetric === 1 ? 100 : undefined, // Max 100 uniquement pour les pourcentages
        },
        tooltip: {
            shared: true,
            intersect: false,
            custom: function ({ dataPointIndex }: { dataPointIndex: number }) {
                return `
                    <div class="apexcharts-tooltip-custom" style="padding: 8px;">
                        ${allSeriesData.map((serie, index) => `
                            <div style="display: flex; align-items: center; margin: 4px 0;">
                                <span style="display: inline-block; width: 8px; height: 8px; 
                                           margin-right: 8px; background-color: ${chartColors[index]}; 
                                           border-radius: 50%;"></span>
                                <span style="margin-right: 8px;">${serie.name}:</span>
                                <strong>${serie.formatter(serie.data[dataPointIndex])}</strong>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        fill: {
            type: 'gradient',
        }
    });

    // Créer la série active pour l'affichage
    const selectedData = currentSeries?.data[selectedMetric];
    const displaySeries = selectedData ? [{
        name: selectedData.name,
        type: 'area',
        data: selectedData.data
    }] : [];

    return (
        <Card sx={sx} {...other}>
            <CardHeader
                title={title}
                subheader={subheader}
                action={
                    <div className="flex gap-2">
                        <ChartSelect
                            options={metrics}
                            value={metrics[selectedMetric]}
                            onChange={(value) => handleChangeMetric(metrics.indexOf(value))}
                        />
                        <ChartSelect
                            options={chart.series.map((item) => item.name)}
                            value={selectedYear}
                            onChange={handleChangeYear}
                        />
                    </div>
                }
            />

            <ChartLegendsCards
                colors={chartColors}
                labels={metrics}
                values={currentSeries?.data.map((serie, index) => {
                    const total = serie.data.reduce((sum, val) => sum + val, 0);
                    const avg = total / serie.data.length;
                    return index === 1 ?
                        `${fNumber(avg)} %` :
                        `${fNumber(total)}`;
                }) ?? []}
            />
            {/* <ChartLegends
                colors={chartColors}
                labels={metrics}
                values={currentSeries?.data.map((serie, index) => {
                    const total = serie.data.reduce((sum, val) => sum + val, 0);
                    const avg = total / serie.data.length;
                    return index === 1 ?
                        `${fNumber(avg)}% moy.` :
                        `${fNumber(total)}`;
                }) ?? []}
                sx={{ px: 3, gap: 3, pl: 4, mt: 2 }}
            /> */}

            <Chart
                type="area"
                series={displaySeries}
                options={chartOptions}
                sx={{
                    px: 3,
                    height: 320,
                }}
            />
        </Card>
    );
}