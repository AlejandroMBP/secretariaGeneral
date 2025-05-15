'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

// Configuración de colores para los tipos de documentos
const TYPE_COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5', '#FF33A8', '#33FFA8', '#A833FF', '#FFA833', '#33A8FF'];

interface DocumentActivityData {
    date: string;
    [key: string]: number | string;
}

export function DocumentActivityChart() {
    const [timeRange, setTimeRange] = useState<string>('90d');
    const [chartData, setChartData] = useState<DocumentActivityData[]>([]);
    const [documentTypes, setDocumentTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/stats/document-activity', {
                    params: { range: timeRange },
                });

                setChartData(response.data.data);
                setDocumentTypes(response.data.types);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching document activity:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    // Configuración dinámica del gráfico basada en los tipos de documentos
    const chartConfig = documentTypes.reduce((config, type, index) => {
        return {
            ...config,
            [type]: {
                label: type,
                color: TYPE_COLORS[index % TYPE_COLORS.length],
            },
        };
    }, {} as ChartConfig);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Actividad de Documentos</CardTitle>
                    <CardDescription>Cargando datos...</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[300px] items-center justify-center">
                    <div className="animate-pulse">Cargando gráfico...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Actividad de Documentos</CardTitle>
                    <CardDescription>Documentos subidos por tipo</CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
                        <SelectValue placeholder="Últimos 3 meses" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Últimos 3 meses
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Últimos 30 días
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Últimos 7 días
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {chartData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                        <AreaChart data={chartData}>
                            <defs>
                                {documentTypes.map((type, index) => (
                                    <linearGradient key={`gradient-${type}`} id={`fill-${type}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={TYPE_COLORS[index % TYPE_COLORS.length]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={TYPE_COLORS[index % TYPE_COLORS.length]} stopOpacity={0.1} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString('es-ES', {
                                        month: 'short',
                                        day: 'numeric',
                                    });
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            });
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            {documentTypes.map((type, index) => (
                                <Area
                                    key={`area-${type}`}
                                    dataKey={type}
                                    type="natural"
                                    fill={`url(#fill-${type})`}
                                    stroke={TYPE_COLORS[index % TYPE_COLORS.length]}
                                    stackId="a"
                                />
                            ))}
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                ) : (
                    <div className="flex h-[250px] items-center justify-center">
                        <p>No hay datos disponibles para el rango seleccionado</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
