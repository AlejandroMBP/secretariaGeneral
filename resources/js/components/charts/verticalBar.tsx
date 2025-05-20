'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface VisitData {
    month: string;
    visits: number;
    avgDuration: string;
    uniqueVisitors?: number;
}

export function VerticalBarr() {
    const [visitasPorMes, setVisitasPorMes] = useState<VisitData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVisitData = async () => {
            try {
                const response = await fetch('/visitas-mensuales');

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setVisitasPorMes(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
                console.error('Error al obtener datos de visitas:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVisitData();
    }, []);

    // Datos mientras carga o si hay error
    if (loading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Estadísticas de Visitas</CardTitle>
                    <CardDescription>Cargando datos...</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[400px] items-center justify-center">
                    <div className="animate-pulse">Cargando gráfico...</div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Estadísticas de Visitas</CardTitle>
                    <CardDescription className="text-red-500">Error: {error}</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[400px] items-center justify-center">
                    <div>No se pudieron cargar los datos</div>
                </CardContent>
            </Card>
        );
    }

    if (!visitasPorMes || visitasPorMes.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Estadísticas de Visitas</CardTitle>
                    <CardDescription>No hay datos disponibles</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[400px] items-center justify-center">
                    <div>No se encontraron registros de visitas</div>
                </CardContent>
            </Card>
        );
    }

    // Calcular métricas
    const totalVisitas = visitasPorMes.reduce((sum, month) => sum + month.visits, 0);
    const peakMonth = visitasPorMes.reduce((max, month) => (month.visits > max.visits ? month : max));

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Estadísticas de Visitas</CardTitle>
                <CardDescription>{totalVisitas.toLocaleString()} visitas en el último período</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ChartContainer
                    config={{
                        visits: {
                            label: 'Visitas',
                            color: 'hsl(210, 80%, 50%)',
                        },
                    }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={visitasPorMes} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} layout="vertical">
                            <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
                            <XAxis type="number" tickFormatter={(value) => value.toLocaleString()} />
                            <YAxis dataKey="month" type="category" width={80} />
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload as VisitData;
                                        return (
                                            <div className="bg-background rounded-md border p-3 shadow-md">
                                                <p className="font-bold">{data.month}</p>
                                                <p>Visitas totales: {data.visits.toLocaleString()}</p>
                                                {data.uniqueVisitors && <p>Visitantes únicos: {data.uniqueVisitors.toLocaleString()}</p>}
                                                <p>Duración promedio: {data.avgDuration}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="visits" fill="hsl(210, 80%, 50%)" radius={[0, 4, 4, 0]} animationDuration={1500}>
                                <LabelList
                                    dataKey="visits"
                                    position="right"
                                    formatter={(value: number) => value.toLocaleString()}
                                    className="fill-foreground text-xs"
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="text-muted-foreground">
                    Mes con más visitas: <span className="font-medium">{peakMonth.month}</span> ({peakMonth.visits.toLocaleString()} visitas)
                </div>
                <div className="text-muted-foreground">
                    Duración promedio: <span className="font-medium">{peakMonth.avgDuration}</span> minutos
                </div>
            </CardFooter>
        </Card>
    );
}
