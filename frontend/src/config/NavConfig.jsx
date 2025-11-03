import { Tickets, TicketPlus, UserCircle, LogOut, HomeIcon, UsersIcon, UserRoundPlusIcon } from 'lucide-react'

export const NavConfig = {
    Requesters: {
        "": [
            { label: "Home", link: "/", icon: HomeIcon },
        ],
        "Tickets": [
            { label: "View Tickets", link: "/tickets", icon: Tickets },
            { label: "Submit New", link: "/ticket-create", icon: TicketPlus },
        ],
    },

    Managers: {
        "": [
            { label: "Home", link: "/", icon: HomeIcon },
        ],
        "Tickets": [
            { label: "View Tickets", link: "/tickets", icon: Tickets },
        ],
        "Agents": [
            { label: "View Agents", link: "/agents", icon: UsersIcon },
            { label: "Create New", link: "/agents/create", icon: UserRoundPlusIcon },
        ],
    },
}

