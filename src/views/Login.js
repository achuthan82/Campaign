// ** React Imports
import { useContext, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

// ** Icons Imports
import { Coffee, X } from 'react-feather'

// ** Custom Hooks
// import { useSkin } from '@hooks/useSkin'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Input, Button, Spinner, Modal, ModalBody, ModalHeader, Row, Col } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

// ** Third Party Components
import { useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import apiConfig from '@configs/apiConfig'
// ** Actions
import { handleLogin } from '@store/authentication'

import axios from 'axios'
// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'

import ComponentSpinner from '@components/spinner/Loading-spinner'

import Avatar from '@components/avatar'

// import logo from '@src/assets/images/logo/logo.png'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

const ToastContent = ({ t, name, role }) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>{name}</h6>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
        <span>You have successfully logged in as an {role} user to the MARKETPLACE. Now you can start to explore. Enjoy!</span>
      </div>
    </div>
  )
}

const ToastContentAllowAccess = ({ message = null }) => (
  <>
  {message !== null && (
  <div className='d-flex'>
      <div className='me-1'>
          {/* <Avatar size='sm' color='error'/> */}
      </div>
      <div className='d-flex flex-column'>
          <div className='d-flex justify-content-between'>
              <span>{message}</span>
          </div>
      </div>
  </div>
  )}
  </>
)


const Login = () => {
  // ** Hooks
  // localStorage.removeItem('cartData')
  // const { skin } = useSkin()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)
  const {token} = useParams()
  // ** State
  const [showError, setShowError] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const moveToDashboard = () => {
    navigate('/dashboard')
  }
  const ability_ = [
    {
      action: 'manage',
      subject: 'all'
    }
  ]
  const defaultValues = {
    password: '',
    loginEmail: '',
    name: '',
    email: '',
    address: '',
    phone: '',
    hierarchy: '',
    hierarchyEmail: '',
    hierarchyPhone: ''
  }
  
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })
  // const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg'
    // source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = data => {
    setShowError('')
    console.log(data.loginEmail)
    if (data.loginEmail.length > 0 && data.password.length > 0) {
      setLoginLoading(true)
    // if (Object.values(data).every(field => field.length > 0)) {
      const config = {
        method: 'post',
        url: `${apiConfig.api.url}auth/login`,
        // headers: { 
        //   Authorization: `Token ${getToken()}`
        // }
        data: { email: data.loginEmail, password: data.password }
      }

      axios(config)
      .then(function (res) {
        if (res.data.status === 200) {
          if (res.data.auth_token) {
            
            const dt = res.data.data
            dt.ability = ability_
            const data = { dt, accessToken: res.data.auth_token, refreshToken: res.data.auth_token }
           
            // const data = { ...res.data.data, accessToken: res.data.auth_token, refreshToken: res.data.refreshToken }
            dispatch(handleLogin(data))
            ability.update(ability_)
            navigate(getHomeRouteForLoggedInUser(res.data.data.role_id))
            toast(t => (
              <ToastContent t={t} role={(data.dt.role_id === 1 && 'Admin') || (data.dt.role_id === 2 && 'Agent') || (data.dt.role_id === 3 && 'Marketplace Member')} name={data.dt.name || data.dt.email || 'Unknown'} />
            ))
          } else setShowError(res.data.message)
        } else setShowError(res.data.message)
        setLoginLoading(false)
      })
      .catch(function (error) {
        console.log(error)
        if (error && error.response) {
          setShowError(error.response.data)
        } else if (error && error.message) {
          setShowError(error.message)
        } setLoginLoading(false)
      })
      // https://iver-survey-system.herokuapp.com/v1
      // useJwt
      //   .login({ email: data.loginEmail, password: data.password })
      //   .then(res => {
      //     const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
      //     dispatch(handleLogin(data))
      //     ability.update(res.data.userData.ability)
      //     navigate(getHomeRouteForLoggedInUser(data.role))
      //     toast.success(
      //       <ToastContent name={data.fullName || data.username || 'John Doe'} role={data.role || 'admin'} />,
      //       { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      //     )
      //   })
      //   .catch(err => console.log(err))
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }
  
  // const onSubmitRegister = data => {
  //   console.log(data)
  //   if (data.name.length > 0 && data.address.length > 0 && data.email.length > 0 && data.phone.length > 0 && data.hierarchy.length > 0) {
  //     setLoginLoading(true)
  //     const config = {
  //       method: 'post',
  //       url: `${apiConfig.api.url}user/interested`,
  //       // url: `https://ivr-marketplace.herokuapp.com/v1/user/interested`,
  //       // headers: { 
  //       //   Authorization: `Token ${getToken()}`
  //       // }
  //       data: { name: data.name, 
  //           address: data.address, 
  //           phone: data.phone, 
  //           email: data.email, 
  //           hierarchy: data.hierarchy,
  //           hierarchy_email: data.hierarchyEmail,
  //           hierarchy_phone: data.hierarchyPhone
  //         }
  //       // 'name': 'Arun n', 'address': "1 Hacker Way, Menlo Park, CA 94025, United States", "phone": "8011111111", "email":"arunnnn@aaa.com", "hierarchy": "Associate"
  //     }

  //     axios(config)
  //     .then(function (res) {
  //       console.log(res)
  //       if (res.data.status === 200) {
  //         setShow(false)
  //         toast.success(
  //           <ToastContentAllowAccess message={res.data.message} />,
  //           { duration:3000 }
  //         )  
  //       } else {
  //         setShow(false)
  //         toast.error(
  //           <ToastContentAllowAccess message={res.data.message} />,
  //           { duration:3000 }
  //         )  
  //       } setLoginLoading(false)
  //     })
  //     .catch(function (error) {
  //       console.log(error)
  //       if (error && error.response) {
  //         // setShowError(error.response.data)
  //         toast.error(
  //           <ToastContentAllowAccess message={error.message} />,
  //           { duration:3000 }
  //         )  
  //       } else if (error && error.message) {
  //         // setShowError(error.message)
  //         toast.error(
  //           <ToastContentAllowAccess message={error.message} />,
  //           { duration:3000 }
  //         )  
  //       } setLoginLoading(false)
  //     })

  //   } else {
  //     for (const key in data) {
  //       console.log(data[key])
  //       if (data[key].length === 0) {
  //         setError(key, {
  //           type: 'manual'
  //         })
  //       }
  //     }
  //   }
  // }

  const redirectLogin = token => {
    setShowError('')
    console.log(token)
    const config = {
      method: 'post',
      url: `${apiConfig.api.url}auth/login`,
      data: { auth_token: token }
    }
    axios(config)
    .then(function (res) {
      if (res.data.status === 200) {
        if (res.data.auth_token) {
          const dt = res.data.data
          dt.ability = ability_
          const data = { dt, accessToken: res.data.auth_token, refreshToken: res.data.auth_token }
          dispatch(handleLogin(data))
          ability.update(ability_)
          navigate(getHomeRouteForLoggedInUser(res.data.data.role_id))
          toast(t => (
            <ToastContent t={t} role={(data.dt.role_id === 1 && 'Admin') || (data.dt.role_id === 2 && 'Agent') || (data.dt.role_id === 3 && 'Marketplace Member')} name={data.dt.name || data.dt.email || 'Unknown'} />
          ))
        } else setShowError(res.data.message)
      } else setShowError(res.data.message)
      setLoading(false)
    })
    .catch(function (error) {
      console.log(error)
      if (error && error.response) {
        setShowError(error.response.data)
      } else if (error && error.message) {
        setShowError(error.message)
      } setLoading(false)
    })
  }
  
  useEffect(() => {
    if (token) {
      setLoading(true)
      redirectLogin(token)
    }
  }, [token])
 
  return (
    <>
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              {/* <h2 className='brand-text text-primary ms-1'>IVR MARKETPLACE</h2> */}
              {/* <img className='app-brand' src={logo} alt='Logo' /> */}
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Welcome to Campaign App
            </CardTitle>
            <CardText className='mb-2 card-text-log'  >Please sign-in to your account</CardText>
            {showError && <p className='text-danger'>{showError}</p>}
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Controller
                  id='loginEmail'
                  name='loginEmail'
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type='email'
                      placeholder='john@example.com'
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div>
              <Button type='submit' disabled={loginLoading} color='primary' block onClick={moveToDashboard} >
                {loginLoading && <Spinner size="sm" className='me-50' />} Login
              </Button>
              {/* <Button disabled={loginLoading} className='mt-50' type='button' color='primary' block onClick={() => {
                    setShow(true)
                  }}>
                Request an account
              </Button> */}
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>

    <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
    <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
    <ModalBody className='px-sm-5 pt-50 pb-5'>
      <div className='text-center mb-2'>
        <h1 className='mb-1'>Request Account</h1>
      </div>
      {/* <Form onSubmit={handleSubmit(onSubmitRegister)}> */}
        <Row className='gy-1 pt-75'>
          <Col md={12} xs={12}>
            <Label for='name'>Full Name</Label>
            <Controller
                id='name'
                name='name'
                control={control}
                render={({ field }) => (
                <Input
                autoFocus
                type='text'
                invalid={errors.name && true}
                {...field}
                />
                )}
              />
          </Col>
          <Col md={12} xs={12}>
            <Label for='address'>Address</Label>
            <Controller
                id='address'
                name='address'
                control={control}
                render={({ field }) => (
                <Input
                autoFocus
                type='text'
                invalid={errors.address && true}
                {...field}
                />
                )}
              />
          </Col>
          <Col md={12} xs={12}>
            <Label for='address'>Phone</Label>
            <Controller
                id='phone'
                name='phone'
                control={control}
                render={({ field }) => (
                <Input
                autoFocus
                type='text'
                invalid={errors.phone && true}
                {...field}
                />
                )}
              />
          </Col>
          <Col md={12} xs={12}>
            <Label className='form-label' for='email'>
                  Email
                </Label>
                <Controller
                  id='email'
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input
                      type='email'
                      placeholder='john@example.com'
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
          </Col>
          <Col md={12} xs={12}>
          <div>
              <Label for='cost'>Hierarchy</Label>
              <Controller
                id='hierarchy'
                name='hierarchy'
                control={control}
                render={({ field }) => (
                <Input
                autoFocus
                type='text'
                invalid={errors.hierarchy && true}
                {...field}
                />
                )}
              />
              
            </div>
          </Col>
          <Col md={12} xs={12}>
          <div>
              <Label for='cost'>Hierarchy Phone</Label>
              <Controller
                id='hierarchyPhone'
                name='hierarchyPhone'
                control={control}
                render={({ field }) => (
                <Input
                type='text'
                invalid={errors.hierarchyPhone && true}
                {...field}
                />
                )}
              />
              
            </div>
          </Col>
          <Col md={12} xs={12}>
          <div>
              <Label for='cost'>Hierarchy Email</Label>
              <Controller
                  id='hierarchyEmail'
                  name='hierarchyEmail'
                  control={control}
                  render={({ field }) => (
                    <Input
                      type='email'
                      placeholder='john@example.com'
                      invalid={errors.hierarchyEmail && true}
                      {...field}
                    />
                  )}
                />
              
            </div>
          </Col>
        </Row>
        
        <Col xs={12} className='text-center mt-2 pt-50'>
          
            <Button type='submit' disabled={loginLoading} className='me-1' color='primary' style={{marginRight: '20px'}}>
            {loginLoading && <Spinner size="sm" className='me-50' />} Send now to request access
            </Button>
            <Button
              type='reset'
              color='secondary'
              outline
              disabled={loginLoading}
              onClick={() => {
                // handleReset()
                setShow(false)
              }}
            >
              Cancel
            </Button>
          </Col>
      {/* </Form> */}
      
    </ModalBody>
    </Modal>
    {loading && <ComponentSpinner txt="Redirecting" />}
    </>
  )
}

export default Login
