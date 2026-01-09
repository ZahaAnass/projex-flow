import { type NavItem } from "@/types";
import {
    LayoutGrid,
    Briefcase,
    CheckSquare,
    Users,
    Shield,
    BarChart3,
    FileText,
    UserCircle
} from "lucide-react";

export const navigation: Record<string, NavItem[]> = {
    admin: [
        { title: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
        { title: "Users", href: "/admin/users", icon: Users },
        { title: "Projects", href: "/admin/projects", icon: Briefcase },
        { title: "Tasks", href: "/admin/tasks", icon: CheckSquare },
        { title: "Roles", href: "/admin/roles", icon: Shield },
    ],

    team_leader: [
        { title: "Dashboard", href: "/team/dashboard", icon: LayoutGrid },
        { title: "My Projects", href: "/team/projects", icon: Briefcase },
        { title: "Team Tasks", href: "/team/tasks", icon: CheckSquare },
    ],

    user: [
        { title: "Dashboard", href: "/user/dashboard", icon: LayoutGrid },
        { title: "My Tasks", href: "/user/tasks", icon: CheckSquare },
    ],

    client: [
        { title: "Dashboard", href: "/client/dashboard", icon: LayoutGrid },
        { title: "My Projects", href: "/client/projects", icon: Briefcase },
        { title: "Progress", href: "/client/reports", icon: BarChart3 },
    ],
};
