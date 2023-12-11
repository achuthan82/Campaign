// React Imports
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import axios from 'axios'
// ** Icons Imports
import { ChevronLeft, X } from 'react-feather'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Input, Button, Spinner } from 'reactstrap'

// import logo from '@src/assets/images/logo/logo.png'
import apiConfig from '@configs/apiConfig'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
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

const ForgotPasswordBasic = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const forgotPassword = (data) => {
    console.log('forgot password', data)
    if (data.loginEmail.length > 0) {
      setLoading(true)
      const config = {
        method: 'post',
        url: `${apiConfig.api.url}auth/forgot_password`,
       
        data: { email: data.loginEmail}
      }
      axios(config).then((response) => {
        console.log(response)
        if (response.data.status === 200) {
          setLoading(false)
          setErrorMessage('')
          setSuccessMessage(response.data.message)
        } else {
          setSuccessMessage('')
          setErrorMessage(response.data.message)
          setLoading(false)
        }
      }).catch((error) => {
         setSuccessMessage('')
         setErrorMessage('')
         setLoading(false)
         toast.error(<ToastContent message={error.message} />, { duration:3000 })  
      })
    } else {
      setError('loginEmail', {type:'manual'})
    }
  }
  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
            
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Forgot Password? 🔒
            </CardTitle>
            {
              successMessage === '' && errorMessage === '' && <CardText className='mb-2'>
              Enter your email and we'll send you instructions to reset your password
            </CardText>
            }
            {
              successMessage !== '' && <CardText className='mb-2 text-primary'>{successMessage}</CardText>
            }
             {
              errorMessage !== '' && <CardText className='mb-2 text-danger'>{errorMessage}</CardText>
            }
            <Form className='auth-forgot-password-form mt-2' onSubmit={handleSubmit(forgotPassword)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Controller
                  id='loginEmail'
                  name='loginEmail'
                  control={control}
                  defaultValue=''
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
                {/* <Input type='email' id='login-email' placeholder='john@example.com' autoFocus /> */}
              </div>
              <Button color='primary' type='submit' block disabled={loading}>
               {loading && <Spinner size="sm" className='me-50'/>} Send reset link
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

export default ForgotPasswordBasic