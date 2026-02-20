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
        { title: "Dashboard", href: "/team/dashboard", icon: LayoutGrid },
        { title: "My Projects", href: "/team/projects", icon: Briefcase },
        { title: "Sprints", href: "/team/sprints", icon: Timer },
        { title: "Team Tasks", href: "/team/tasks", icon: CheckSquare },
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
