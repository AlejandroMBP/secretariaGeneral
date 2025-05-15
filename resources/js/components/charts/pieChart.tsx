'use client';

import { TrendingUp } from 'lucide-react';
import * as React from 'react';
import { Label, Pie, PieChart as RechartsPieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
    { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
    { browser: 'firefox', visitors: 287, fill: 'var(--color-firefox)' },
    { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
    { browser: 'other', visitors: 190, fill: 'var(--color-other)' },
];

const chartConfig = {
    visitors: {
        label: 'Visitors',
    },
    chrome: {
        label: 'Chrome',
        color: 'hsl(200, 100%, 50%)', // Cambié el color de Chrome
    },
    safari: {
        label: 'Safari',
        color: 'hsl(120, 100%, 40%)', // Cambié el color de Safari
    },
    firefox: {
        label: 'Firefox',
        color: 'hsl(30, 100%, 50%)', // Cambié el color de Firefox
    },
    edge: {
        label: 'Edge',
        color: 'hsl(180, 100%, 40%)', // Cambié el color de Edge
    },
    other: {
        label: 'Other',
        color: 'hsl(60, 100%, 60%)', // Cambié el color para Other
    },
} satisfies ChartConfig;

export function PieChart() {
    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
    }, []);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Donut with Text</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <RechartsPieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                    Visitors
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </RechartsPieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
            </CardFooter>
        </Card>
    );
}
