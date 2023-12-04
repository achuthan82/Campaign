// ** React Imports
import { Link, useHref} from "react-router-dom"
import { Fragment, useState, useEffect } from "react"

// ** Third Party Components
import InputNumber from "rc-input-number"
import PerfectScrollbar from "react-perfect-scrollbar"
import { ShoppingCart, X, Plus, Minus } from "react-feather"
// ** Reactstrap Imports
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Badge,
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  ListGroup,
  ListGroupItem
} from "reactstrap"

// ** Store & Actions
// import { useDispatch } from "react-redux"
// import {
//   // getCartItems,
//   deleteCartItem,
//   getProduct
// } from "@src/views/apps/ecommerce/store"

// ** Styles
import "@styles/react/libs/input-number/input-number.scss"
// import { getCartList } from "../../../../utility/Utils"
// ** Store & Actions
import { useDispatch, useSelector } from "react-redux"
import { getCartData, handleDeleteItems } from "../../../../redux/navbar"
import axios from "axios"
import Swal from "sweetalert2"
import apiConfig from "@configs/apiConfig"
import withReactContent from "sweetalert2-react-content"
import { toast } from "react-hot-toast"
const CartDropdown = () => {
  const MySwal = withReactContent(Swal)
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
  // ** State
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const history = useHref()
  console.log('history', history)
  // const [popoverOpen, setPopoverOpen] = useState(false)
  // const data = getCartList()
  // const store = JSON.parse(data)
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.navbar)
  // const history = useHistory()
  // const currentRoute = history.location.pathname
  // console.log('current-route', currentRoute)


  console.log("store", store)
  console.log(store?.cartData?.length)
  // ** Function to toggle Dropdown
  const toggle = () => setDropdownOpen(!dropdownOpen)

  useEffect(() => {
    dispatch(getCartData())
  }, [])
  const handleDelete = (item) => {
    // console.log(id)
    return MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ml-1"
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        const config = {
          method: "delete",
          url: `${apiConfig.api.url}cart/item/${item.id}`
          // url: `https://ivr-marketplace.herokuapp.com/v1/cart/item/${id}`
        }

        axios(config)
          .then(function (response) {
            console.log(response)
            console.log(response.data.status_code)
            if (response.data.status_code === 200) {
              dispatch(getCartData())
              dispatch(handleDeleteItems(item))
              MySwal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Successfully Deleted.",
                customClass: {
                  confirmButton: "btn btn-success"
                }
              })
            } else if (response.data.status_code === 401) {
              toast.error(<ToastContent message={response.data.message} />, {
                duration: 3000
              })
            }
          })
          .catch((error) => {
            console.log(error)
            if (error && error.status === 401) {
              toast.error(<ToastContent message={error.message} />, {
                duration: 2000
              })
            } else if (error) {
              toast.error(<ToastContent message={error.message} />, {
                duration: 2000
              })
            }
          })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: "Cancelled",
          text: "Cart item Delete Cancelled",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-success"
          }
        })
      }
    })
  }
  const renderCartItems = () => {
    console.log("store", store)
    if (store && store.cartData && store.cartData.length > 0) {
      return (
        <Fragment>
          <PerfectScrollbar
            className="scrollable-container media-list"
            options={{
              wheelPropagation: false
            }}
          >
            {store &&
              store.cartData &&
              store.cartData.length > 0 &&
              store.cartData.map((item) => {
                return (
                  <div key={item.id} className="list-item align-items-center">
                    {/* <img className='d-block rounded me-1' src={item.image} alt={item.name} width='62' /> */}
                    <div className="list-item-body flex-grow-1">
                      <div className="media-heading">
                        <h6 className="cart-item-title">
                          {`${item.lead_type_info.description}`}
                        </h6>
                        <small className="cart-item-by">{`(${item.state})`}</small>
                      </div>
                      <div className="cart-item-qty">{item.quantity} Leads</div>
                      <h5 className="cart-item-price">
                        ${`${item.lead_type_info.cost}`}
                      </h5>
                      <span onClick={() => handleDelete(item)} style={{cursor:'pointer'}}>
                        {" "}
                        <X size={14} className="" />
                      </span>
                    </div>
                  </div>
                )
              })}
          </PerfectScrollbar>
          <li className="dropdown-menu-footer">
            {history !== '/cart' && <Button tag={Link} to="/cart" color="primary" block onClick={toggle}>
              View Cart
            </Button> }
            
          </li>
        </Fragment>
      )
    } else {
      return <p className="m-0 p-1 text-center">Your cart is empty</p>
    }
  }

  return (
    <>
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        tag="li"
        className="dropdown-cart nav-item me-25"
      >
        <DropdownToggle tag="a" className="nav-link position-relative">
          <ShoppingCart className="ficon" id="controlledPopover" />
          {store.cartData ? (
            <Badge pill color="primary" className="badge-up">
              {store?.cartData?.length}
            </Badge>
          ) : null}
        </DropdownToggle>
        <DropdownMenu
          end
          tag="ul"
          className="dropdown-menu-media dropdown-cart mt-0"
        >
          <li className="dropdown-menu-header">
            <DropdownItem tag="div" className="d-flex" header>
              <h4 className="notification-title mb-0 me-auto">My Cart</h4>
            </DropdownItem>
          </li>
          {renderCartItems()}
        </DropdownMenu>
      </Dropdown>
      
    </>
  )
}

export default CartDropdown
