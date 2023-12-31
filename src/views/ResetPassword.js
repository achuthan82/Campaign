// ** React Imports
import { Link, useParams, useNavigate } from 'react-router-dom'

// ** Icons Imports
import { ChevronLeft } from 'react-feather'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Button, Spinner } from 'reactstrap'

import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'
import { toast } from 'react-hot-toast'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

// import logo from '@src/assets/images/logo/logo.png'
import apiConfig from '@configs/apiConfig'
import { useState } from 'react'
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
const ResetPasswordBasic = () => {
  localStorage.removeItem('accessToken')
  const navigate = useNavigate('/login')
  const params = useParams() 
  const register_token = params.token
  console.log('params', params)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm()
  const [loading, setLoading] = useState(false)
  const onSubmit = data => {
    console.log(data)
    if (Object.values(data).every(field => field.length > 0)) {
      setLoading(true)
      const config = {
        method: 'patch',
        url: `${apiConfig.api.url}auth/reset_password`,
        headers: { 
          Authorization: `Token ${register_token}`
        },
        data: { new_password: data.password, confirm_password:data.confirmPassword}
      }

      axios(config)
      .then(function (res) {
        setLoading(false)
        if (res.data.status === 200) {
          toast.success(<ToastContent message={res.data.message} />, { duration:3000 })  
          navigate('/login')
        } else {
          toast.error(<ToastContent message={res.data.message} />, { duration:3000 })  

        }
 
      }).catch((error) => {
        setLoading(false)
        console.log(error)
        toast.error(<ToastContent message={error.message} />, { duration:3000 })  

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
                  rules={{
                    required: 'This field is required'
                  }}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} onKeyDown={handleKeyDown} />
                  )}
                />
                {errors.password && <p className='text-danger'>{errors.password.message}</p>}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='confirmPassword'>
                  Confirm Password
                </Label>
                <Controller
                  id='confirmPassword'
                  name='confirmPassword'
                  control={control}
                  rules={{
                    required: 'This field is required',
                    validate: (value) => value === getValues('password') || 'Passwords do not match'
                  }}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.confirmPassword && true} {...field} onKeyDown={handleKeyDown}/>
                  )}
                />
                 {errors.confirmPassword && <p className='text-danger'>{errors.confirmPassword.message}</p>}
              </div>
              <Button color='primary' block disabled={loading}>
              {loading && <Spinner size="sm" className='me-50'/>} Set New Password
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <Link to='/login'>
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
