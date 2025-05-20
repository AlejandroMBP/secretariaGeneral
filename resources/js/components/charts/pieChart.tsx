'use client';

import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Label, Pie, PieChart as RechartsPieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ApiData {
    tipo: string;
    cantidad: number;
    ultima_fecha_carga: string;
    color: string;
}

export function PieChart() {
    const [chartData, setChartData] = useState<ApiData[]>([]);
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/document-stats');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ApiData[] = await response.json();
                console.log('Datos de la API:', data);

                // Transformar datos para la gráfica
                const formattedData = data.map((item) => ({
                    ...item,
                    fill: item.color, // Usamos el color que viene de la API
                }));

                setChartData(formattedData);

                // Generar configuración dinámica basada en los tipos
                const dynamicConfig = data.reduce((config, item) => {
                    const key = item.tipo.toLowerCase().replace(/\s+/g, '_');
                    config[key] = {
                        label: item.tipo,
                        color: item.color,
                    };
                    return config;
                }, {} as ChartConfig);

                console.log('Configuración generada:', dynamicConfig);
                setChartConfig(dynamicConfig);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalVisitors = chartData.reduce((acc, curr) => acc + curr.cantidad, 0);

    if (loading) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Cargando datos...</CardTitle>
                </CardHeader>
                <CardContent className="flex h-[250px] items-center justify-center">
                    <div className="animate-pulse">Cargando gráfica...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Distribución de Documentos</CardTitle>
                <CardDescription>Documentos por tipo</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <RechartsPieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="cantidad" nameKey="tipo" innerRadius={60} strokeWidth={5}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                    Documentos
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
                    Resumen documental <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Total de documentos: {totalVisitors}</div>
            </CardFooter>
        </Card>
    );
}
