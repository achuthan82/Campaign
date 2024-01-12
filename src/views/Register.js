// ** React Imports
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub, Coffee, X } from 'react-feather'
import apiConfig from '@configs/apiConfig'
// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Input, Button, Spinner } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Avatar from '@components/avatar'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

// import logo from '@src/assets/images/logo/logo.png'

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

const RegisterBasic = () => {
  const navigate = useNavigate()
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({ })
  const [loading, setLoading] = useState(false)
  localStorage.removeItem('accessToken')
  const data = useParams()
  const register_token = data.token
  console.log('data', data)
  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      setLoading(true)
      const config = {
        method: 'put',
        url: `${apiConfig.api.url}user/register_from_invitation`,
        headers: { 
          Authorization: `Token ${register_token}`
        },
        data: { password: data.password.trim(' '), confirm_password: data.confirmPassword.trim(' ') }
      }
      
      axios(config)
      .then(function (response) {
        setLoading(false)

        console.log(response)
        if (response.data.status === 200) {
          toast.success(<ToastContent message={response.data.message} />, { duration:3000 })  
          navigate('/login')
        } else {
          toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  

        }
       
      }).catch(() => {
        setLoading(false)

        toast.error(<ToastContent message='Network Error' />, { duration:3000 })  

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
          {/* <CardTitle>Register</CardTitle> */}
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              {/* <img className='app-brand' src={logo} alt='Logo' /> */}
              {/* <h2 className='brand-text text-primary ms-1'>IVR MARKETPLACE</h2> */}
            </Link>
            <h3>Sign Up</h3>
            <Form className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
            
            <div className='mb-1'>
                <Label className='form-label' for='new-password'>
                  New Password
                </Label>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  rules={{
                    required: 'This field is required',
                    pattern:{
                      value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:'Password must be min 8 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase'
                    }
                  }}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field}  onKeyDown={handleKeyDown}/>
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
                    <InputPasswordToggle className='input-group-merge' invalid={errors.confirmPassword && true} {...field} onKeyDown={handleKeyDown} />
                  )}
                />
                 {errors.confirmPassword && <p className='text-danger'>{errors.confirmPassword.message}</p>}
              </div>
              {/* <div className='form-check mb-1'>
                <Input type='checkbox' id='terms' />
                <Label className='form-check-label' for='terms'>
                  I agree to
                  <a className='ms-25' href='/' onClick={e => e.preventDefault()}>
                    privacy policy & terms
                  </a>
                </Label>
              </div> */}
              <Button color='primary' block disabled={loading}>
              {loading && <Spinner size="sm" className='me-50'/>}  Sign up
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
