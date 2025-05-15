'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

interface ChartData {
    month: string;
    total: number;
}

interface ApiResponse {
    monthlyData: ChartData[];
    weeklyTotal: number;
    weekRange: string;
}

const chartConfig = {
    total: {
        label: 'Documentos',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

export function MonthlyActivityChart() {
    const [data, setData] = useState<ChartData[]>([]);
    const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
    const [weekRange, setWeekRange] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<ApiResponse>('/stats/monthly-activity');
                setData(response.data.monthlyData);
                setWeeklyTotal(response.data.weeklyTotal);
                setWeekRange(response.data.weekRange);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Actividad por mes</CardTitle>
                    <CardDescription>Cargando datos...</CardDescription>
                </CardHeader>
                <CardContent className="flex h-64 items-center justify-center">
                    <div className="animate-pulse">Cargando gráfica...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Actividad por mes</CardTitle>
                <CardDescription>Año {new Date().getFullYear()}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{
                            left: -20,
                        }}
                        width={500}
                        height={300}
                    >
                        <XAxis type="number" dataKey="total" hide />
                        <YAxis
                            dataKey="month"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="total" fill="hsl(200, 100%, 50%)" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="text-muted-foreground leading-none">
                    Total de documentos esta semana ({weekRange}): <span className="font-semibold">{weeklyTotal}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
