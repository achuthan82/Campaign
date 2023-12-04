// ** React Imports
import { Link } from 'react-router-dom'

// ** Icons Imports
import { ChevronLeft } from 'react-feather'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Button } from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'
// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

// import logo from '@src/assets/images/logo/logo.png'

const ResetPasswordBasic = () => {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = data => {
    console.log(data)
    if (Object.values(data).every(field => field.length > 0)) {
      const config = {
        method: 'post',
        url: `${apiConfig.api.url}auth/login`,
        // headers: { 
        //   Authorization: `Token ${getToken()}`
        // }
        data: { new_password: data.password, confirm_password: data.password }
      }

      axios(config)
      .then(function (res) {
        console.log(res)
        // const dt = res.data.data
      //   dt.ability = ability_
      //   const data = { dt, accessToken: res.data.auth_token, refreshToken: res.data.auth_token }
      //   // const data = { ...res.data.data, accessToken: res.data.auth_token, refreshToken: res.data.refreshToken }
      //   dispatch(handleLogin(data))
      //   ability.update(ability_)
      //   let role = ''
      //   if (res.data.data.role_id === 1) role = 'Admin'
      //   if (res.data.data.role_id === 2) role = 'Agent'
      //   if (res.data.data.role_id === 3) role = 'Marketplace Member'
      //   navigate(getHomeRouteForLoggedInUser(role))
      //   toast(t => (
      //     <ToastContent t={t} role={(data.role_id === 1 && 'Admin') || (data.role_id === 2 && 'Agent') || (data.role_id === 3 && 'Marketplace Member')} name={data.name || data.email || 'Unknown'} />
      //   ))
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
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              {/* <img className='app-brand' src={logo} alt='Logo' /> */}
              {/* <h2 className='brand-text text-primary ms-1'>IVR MARKETPLACE</h2> */}
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Reset Password 🔒
            </CardTitle>
            <CardText className='mb-2'>Your new password must be different from previously used passwords</CardText>
            <Form className='auth-reset-password-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='new-password'>
                  New Password
                </Label>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='confirmPassword'>
                  Confirm Password
                </Label>
                <Controller
                  id='confirmPassword'
                  name='confirmPassword'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.confirmPassword && true} {...field} />
                  )}
                />
              </div>
              <Button color='primary' block>
                Set New Password
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <Link to='/pages/login-basic'>
                <ChevronLeft className='rotate-rtl me-25' size={14} />
                <span className='align-middle'>Back to login</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ResetPasswordBasic
