// ** React Imports
import { Link } from 'react-router-dom'

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub, Coffee, X } from 'react-feather'
import apiConfig from '@configs/apiConfig'
// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Input, Button } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Avatar from '@components/avatar'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

// import logo from '@src/assets/images/logo/logo.png'

const ToastContent = ({ t, message }) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>{message}</h6>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
        {/* <span>You have successfully logged in as an {role} user to AIM. Now you can start to explore. Enjoy!</span> */}
      </div>
    </div>
  )
}

const RegisterBasic = () => {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ })

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      const config = {
        method: 'post',
        url: `${apiConfig.api.url}user/signup`,
        
        data: { name: data.name, email: data.email, password: data.password }
      }

      axios(config)
      .then(function (res) {
        console.log(res)
        const dt = res.data
        // dt.ability = ability_
        // const data = { dt, accessToken: res.data.auth_token, refreshToken: res.data.auth_token }
        // // const data = { ...res.data.data, accessToken: res.data.auth_token, refreshToken: res.data.refreshToken }
        // dispatch(handleLogin(data))
        // ability.update(ability_)
        // let role = ''
        // if (res.data.data.role_id === 1) role = 'Admin'
        // if (res.data.data.role_id === 2) role = 'Agent'
        // if (res.data.data.role_id === 3) role = 'Marketplace Member'
        // navigate(getHomeRouteForLoggedInUser(role))
        toast(t => (
          <ToastContent t={t}  message={dt.message || 'Unknown'} />
        ))
      }).catch(err => console.log(err))
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

  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          {/* <CardTitle>Register</CardTitle> */}
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              {/* <img className='app-brand' src={logo} alt='Logo' /> */}
              {/* <h2 className='brand-text text-primary ms-1'>IVR MARKETPLACE</h2> */}
            </Link>
            <h3>Sign Up</h3>
            <Form className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='name'>
                  Name
                </Label>
                <Controller
                  id='name'
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type='text'
                      placeholder='johndoe'
                      invalid={errors.name && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='mb-1'>
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
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='password'>
                  Password
                </Label>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' id='password' 
                      invalid={errors.password && true}
                      {...field} />
                  )}
                />
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='terms' />
                <Label className='form-check-label' for='terms'>
                  I agree to
                  <a className='ms-25' href='/' onClick={e => e.preventDefault()}>
                    privacy policy & terms
                  </a>
                </Label>
              </div>
              <Button color='primary' block>
                Sign up
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>Already have an account?</span>
              <Link to='/login'>
                <span>Sign in instead</span>
              </Link>
            </p>
            
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default RegisterBasic
