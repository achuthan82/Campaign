// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power
} from "react-feather"

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap"

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/authentication'
import apiConfig from "../../../../configs/apiConfig"
import axios from "axios"
import { toast } from 'react-hot-toast'

// ** Default Avatar Image
// import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg"

// ** Utils
import { getUserData, getToken } from '@utils'

const ToastContent = ({ message = null }) => (
  <>
    {message !== null && (
      <div className="d-flex">
        <div className="me-1">{/* <Avatar size='sm' color='error'/> */}</div>
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between">
            <span>{message}</span>
          </div>
        </div>
      </div>
    )}
  </>
)

const UserDropdown = () => {
  const dispatch = useDispatch()
  const token = getToken()
  const user = getUserData()
  const logout = () => {
    const config = {
      method:'get',
      url: `${apiConfig.api.url}auth/logout`,
      headers: { 
        Authorization: `Token ${token}`
      }
    }
    axios(config).then((response) => {
      if (response.data.status === 200) {
        dispatch(handleLogout)
      } else {
        toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
      }
    }).catch(() => {
      toast.error(<ToastContent message='Network Error' />, { duration:3000 })  

    })
  }
  // ** Store Vars

  let role = ""
  if (user?.dt?.role_id === 1) role = 'Admin'
  if (user?.dt?.role_id === 2) role = 'Agent'
  if (user?.dt?.role_id === 3) role = 'Marketplace Member'
  console.log(role)
  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">{user && user.dt ? user.dt.first_name : 'Kevin'}</span>
          <span className="user-status">{user && user.dt ? user.dt.role_id === 1 ? 'Admin' : 'Agent' : ''}</span>
        </div>
        {/* <Avatar
          img={defaultAvatar}
          imgHeight="40"
          imgWidth="40"
          status="online"
        /> */}
        {/* <Avatar color={`${states[Math.floor(Math.random() * states.length)]}`} content={activeUser.name} initials /> */}
        <Avatar color="primary" content={user && user.dt ? user.dt.first_name : 'Kevin'} initials />
          
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/login" onClick={logout}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
