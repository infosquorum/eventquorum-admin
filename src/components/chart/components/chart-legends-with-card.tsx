import { Card, CardContent } from '@mui/material';
import { mergeClasses } from 'minimal-shared/utils';
// import { Card, CardContent } from '@/components/ui/card';

export type ChartLegendsCardsProps = {
    className?: string;
    sx?: React.CSSProperties;
    labels?: string[];
    colors?: string[];
    values?: string[];
    sublabels?: string[];
    icons?: React.ReactNode[];
    slotProps?: {
        card?: React.ComponentProps<typeof Card>;
        content?: React.ComponentProps<typeof CardContent>;
        icon?: React.ComponentProps<'span'>;
        value?: React.ComponentProps<'span'>;
        label?: React.ComponentProps<'span'>;
    };
};

export function ChartLegendsCards({
    className,
    slotProps,
    icons = [],
    values = [],
    labels = [],
    colors = [],
    sublabels = [],
    ...other
}: ChartLegendsCardsProps) {
    return (
        <div
            className={mergeClasses([
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mx-4 mt-2 lg:h-[120px]",
                className
            ])}
            {...other}
        >
            {labels.map((series, index) => (
                <Card
                    key={series}
                    className="transition-all hover:shadow-md"
                    {...slotProps?.card}
                >
                    <CardContent className="p-2" {...slotProps?.content}>
                        <div className="flex items-center space-x-2">
                            {icons.length ? (
                                <span
                                    className="inline-flex text-xl"
                                    style={{ color: colors[index] }}
                                    {...slotProps?.icon}
                                >
                                    {icons[index]}
                                </span>
                            ) : (
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: colors[index] }}
                                />
                            )}

                            <span
                                className="font-medium text-sm"
                                {...slotProps?.label}
                            >
                                {series}
                                {!!sublabels.length && <> {` (${sublabels[index]})`}</>}
                            </span>
                        </div>

                        {values[index] && (
                            <span
                                className="block mt-2 text-lg font-semibold"
                                {...slotProps?.value}
                            >
                                {values[index]}
                            </span>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}