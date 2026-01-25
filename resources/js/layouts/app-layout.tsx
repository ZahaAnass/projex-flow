import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { Toaster } from "@/components/ui/sonner"
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <main>{children}</main>
        <Toaster richColors position="top-right" />
    </AppLayoutTemplate>
);
