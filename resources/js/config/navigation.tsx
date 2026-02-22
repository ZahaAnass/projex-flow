import { type NavItem } from "@/types";
import {
    LayoutGrid,
    Briefcase,
    CheckSquare,
    Users,
    Shield,
    Timer,
    Clock,
    Activity
} from "lucide-react";

export const navigation: Record<string, NavItem[]> = {
    admin: [
        { title: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
        { title: "Users", href: "/admin/users", icon: Users },
        { title: "Projects", href: "/admin/projects", icon: Briefcase },
        { title: "Sprints", href: "/admin/sprints", icon: Timer }, // New
        { title: "Tasks", href: "/admin/tasks", icon: CheckSquare },
        { title: "Time Logs", href: "/admin/time-entries", icon: Clock }, // New
        { title: "Activity", href: "/admin/activities", icon: Activity }, // New
        { title: "Roles", href: "/admin/roles", icon: Shield },
    ],

    team_leader: [
        { title: "Dashboard", href: "/leader/dashboard", icon: LayoutGrid },
        { title: "My Projects", href: "/leader/projects", icon: Briefcase },
        { title: "Sprints", href: "/leader/sprints", icon: Timer },
        { title: "Team Tasks", href: "/leader/tasks", icon: CheckSquare },
        { title: "Team Time Logs", href: "/leader/time-entries", icon: Clock },
    ],

    user: [
        { title: "Dashboard", href: "/user/dashboard", icon: LayoutGrid },
        { title: "My Tasks", href: "/user/tasks", icon: CheckSquare },
        { title: "My Logs", href: "/user/time-entries", icon: Clock },
    ],

    client: [
        { title: "Dashboard", href: "/client/dashboard", icon: LayoutGrid },
        { title: "My Projects", href: "/client/projects", icon: Briefcase },
    ],
};
