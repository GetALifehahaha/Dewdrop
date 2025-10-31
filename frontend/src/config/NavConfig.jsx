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
        "Account": [
            { label: "View Account", link: "/me", icon: UserCircle },
            { label: "Log out", link: "/logout", icon: LogOut },
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
        "Account": [
            { label: "View Account", link: "/me", icon: UserCircle },
            { label: "Log out", link: "/logout", icon: LogOut },
        ],
    },
}

