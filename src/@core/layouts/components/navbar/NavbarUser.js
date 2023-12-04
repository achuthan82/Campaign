// ** Dropdowns Imports
import UserDropdown from "./UserDropdown"
import NavCart from "./NavCart"

const NavbarUser = () => {
  return (
    <>
    <ul className="nav navbar-nav align-items-center ms-auto">
      <li style={{marginRight: '30px'}}><NavCart /></li>
      <l1><UserDropdown /></l1>
    </ul>
    </>
  )
}
export default NavbarUser
