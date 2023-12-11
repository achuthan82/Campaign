import { Mail, Home, Sliders, Briefcase, Search, List, UserCheck, Gift, Bell, ShoppingBag, AlignJustify, AlignLeft, Settings, Users} from "react-feather"

export default [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home size={20} />,
    // visible: ["Admin", "Marketplace Member", "Agent"],
    navLink: "/dashboard"
  },
  {
    id: "Settings",
    title: "Settings",
    icon: <Sliders size={20}/>,
    navLink: "/settings"
  },
  {
    id: "Users",
    title: "Users",
    icon: <Users size={20}/>,
    navLink: "/users"
  }
  
]
