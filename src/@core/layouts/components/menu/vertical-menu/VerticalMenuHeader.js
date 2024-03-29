// ** React Imports
import { useEffect } from "react"
import { NavLink } from "react-router-dom"

// ** Icons Imports
import { Disc, X, Circle } from "react-feather"

// ** Config
import themeConfig from "@configs/themeConfig"

// ** Utils
import { getUserData } from "@utils"

// import logo from '@src/assets/images/logo/logo.png'

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
    setMenuHover,
    setLoadedOnce
  } = props

  // ** Vars
  const user = getUserData()
 console.log(user)
  // ** Reset open group
  const expand = () => {
    setLoadedOnce(false)
    setMenuCollapsed(true)
    setMenuHover(false)
  }
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
    console.log(themeConfig.app.appName)
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={expand}
        />
      )
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }

  return (
    <div className="navbar-header mb-1">
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item me-auto">
          <NavLink
            to= "/"
            className="navbar-brand"
          >
            <span className="brand-logo">
        
              {/* <img src={logo} alt="logo" />
              <small className="d-block font-bold">Marketplace</small> */}
            </span>
            <h4 className="brand-text p-0 m-0">Campaign</h4> 
          </NavLink>
        </li>
        <li className="nav-item nav-toggle">
          <div className="nav-link modern-nav-toggle cursor-pointer">
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  )
}

export default VerticalMenuHeader
