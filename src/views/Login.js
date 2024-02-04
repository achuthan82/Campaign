// ** React Imports
import {useState} from 'react'
import { Link, useNavigate} from 'react-router-dom'

// ** Icons Imports
import { Coffee, X } from 'react-feather'

// ** Custom Hooks
// import { useSkin } from '@hooks/useSkin'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

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

import ComponentSpinner from '@components/spinner/Loading-spinner'

import Avatar from '@components/avatar'

// import logo from '@src/assets/images/logo/logo.png'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

const ToastContent = ({ t, name}) => {
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
        <span>You have successfully logged in to  the CAMPAIGN APP. Now you can start to explore. Enjoy!</span>
      </div>
    </div>
  )
}

const Login = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log(navigate)
  // ** State
  const [showError, setShowError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
 
  const defaultValues = {
    password: '',
    loginEmail: '',
    name: '',
    email: ''
    // address: '',
    // phone: '',
    // hierarchy: '',
    // hierarchyEmail: '',
    // hierarchyPhone: ''
  }
  
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = data => {
    setShowError('')
    console.log(data.loginEmail)
    if (data.loginEmail.length > 0 && data.password.length > 0) {
      setLoginLoading(true)
      const config = {
        method: 'post',
        url: `${apiConfig.api.url}auth/login`,
       
        data: { email: data.loginEmail, password: data.password }
      }

      axios(config)
      .then(function (res) {
        if (res.data.status === 200) {
          if (res.data.auth_token) {
            const dt = res.data.data
            const data = { dt, accessToken: res.data.auth_token, refreshToken: res.data.auth_token }
            console.log('data', data)
            // setLoading(false)
            dispatch(handleLogin(data))
            navigate('/dashboard')
            toast(t => (
              <ToastContent t={t}  name={data.dt.first_name || data.dt.email || 'Unknown'} />
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
  const handleKeyDown = (event) => {
    console.log('event', event)
    if (event.key === ' ') {
      event.preventDefault()
    }
  }
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
                {errors.loginEmail && <span className='text-danger'>This field is required</span>}
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
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} onKeyDown={handleKeyDown}/>
                  )}
                />
                {errors.password && <span className='text-danger'>This field is required</span>}

              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div>
              <Button type='submit' disabled={loginLoading} color='primary' className='' block>
                {loginLoading && <Spinner size="sm" className='me-50' />} Login
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>New on our platform?</span>
              <Link to='/new-user-register'>
                <span>Create an account</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>

    {/* {loading && <ComponentSpinner txt="Redirecting" />} */}
    </>
  )
}

export default Login
