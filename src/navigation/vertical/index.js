import { Mail, Home, Sliders, Briefcase, Search, List, UserCheck, Gift, Bell, ShoppingBag, AlignJustify, AlignLeft, Settings, Users, Type, Volume} from "react-feather"
// import { getUserData} from '@utils'
//Visibility---      1-Admin  2-Agent

export default [
  {
    id: "Dashboard",
    title: "Dashboard",
    icon: <Home size={20} />,
    // visible: ["Admin", "Marketplace Member", "Agent"],
    navLink: "/dashboard",
    visible:[1, 2]
  },
  {
    id: "Campaign",
    title: "Campaign",
    icon: <Volume size={20} />,
    // visible: ["Admin", "Marketplace Member", "Agent"],
    navLink: "/campaign",
    visible:[1, 2]
  },
  {
    id: "Settings",
    title: "Settings",
    icon: <Sliders size={20}/>,
    navLink: "/settings",
    visible:[1, 2]
  },
  {
    id: "Tokens",
    title: "Tokens",
    icon: <Type size={20}/>,
    navLink: "/token",
    visible:[1, 2]
  },
  {
    id: "Users",
    title: "Users",
    icon: <Users size={20}/>,
    navLink: "/users",
    visible:[1]
  } 
]
