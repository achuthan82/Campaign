import { Mail, Home, Sliders, Briefcase, Search, List, UserCheck, Gift, Bell, ShoppingBag, AlignJustify, AlignLeft, Settings, Users} from "react-feather"
// import { getUserData} from '@utils'


export default [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home size={20} />,
    // visible: ["Admin", "Marketplace Member", "Agent"],
    navLink: "/dashboard",
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
    id: "Users",
    title: "Users",
    icon: <Users size={20}/>,
    navLink: "/users",
    visible:[1]
    // disabled: getUserData && getUserData.dt && getUserData.dt.role_id !== 1
  }
  
]
