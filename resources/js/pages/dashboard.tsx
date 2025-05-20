import { DocumentActivityChart } from '@/components/charts/AreaBar';
import { MonthlyActivityChart } from '@/components/charts/horizontalBar';
import { PieChart } from '@/components/charts/pieChart';
import { VerticalBarr } from '@/components/charts/verticalBar';
import usePermissions from '@/hooks/usePermissions';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { hasPermission } = usePermissions();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <MonthlyActivityChart />
                    {hasPermission('ver usuarios') && <PieChart />}
                    <VerticalBarr />
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    {hasPermission('ver usuarios') && <DocumentActivityChart />}
                </div>
            </div>
        </AppLayout>
    );
}
