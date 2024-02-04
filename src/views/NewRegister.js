// ** React Imports
import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub, Coffee, X } from 'react-feather'
import apiConfig from '@configs/apiConfig'
// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Input, Button, Spinner, Row, Col } from 'reactstrap'
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
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
    // getValues
  } = useForm({ })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  localStorage.removeItem('accessToken')
  const data = useParams()
  console.log('data', data, apiConfig.api.url)
  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      setLoading(true)
      const config = {
        method: 'post',
        url: `${apiConfig.api.url}signup`,
        data: { email: data.loginEmail,
            first_name: data.first_name, 
            last_name:data.last_name, 
            role_id:2
          }
      }
      
      axios(config)
      .then(function (response) {
        setLoading(false)

        console.log(response)
        if (response.data.status === 200) {
            setErrorMessage('')
            setSuccessMessage('Please check your inbox')  
        } else {
            setSuccessMessage('')
            setErrorMessage(response.data.message)
        }
       
      }).catch(() => {
        setSuccessMessage('')
        setErrorMessage('')
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

  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
            </Link>
            <h3>Sign Up</h3>
            {
              successMessage === '' && errorMessage === '' && <CardText className='mt-1 mb-2'>
                Unlock the Next Step! Enter your details, and we'll send you a personalized link to set up your account securely. Let's get started!
            </CardText>
            }
            {
              successMessage !== '' && <CardText className='mt-1 mb-2 text-primary'>{successMessage}</CardText>
            }
             {
              errorMessage !== '' && <CardText className='mt-1 mb-2 text-danger'>{errorMessage}</CardText>
            }
            <Form className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
            <Row className='mb-1'>
                <Col>
                  <Label>First Name<span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="first_name"
                  rules={{ required: "First Name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref} 
                      autoFocus
                      type="text"
                      id="first_name"
                      invalid={errors.first_name}
                    />
                  )}
                />
                {errors.first_name && (
                  <p className="text-danger">{errors.first_name.message}</p>
                )}
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Last Name<span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="last_name"
                  rules={{ required: "Last Name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref} 
                      autoFocus
                      type="text"
                      id="last_name"
                      invalid={errors.last_name}
                    />
                  )}
                />
                {errors.last_name && (
                  <p className="text-danger">{errors.last_name.message}</p>
                )}
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Email<span className='text-danger'>*</span></Label>
                  <Controller
                  id='loginEmail'
                  name='loginEmail'
                  control={control}
                  rules={{ required: "Email is required",
                           pattern: {
                                      value: /.+\..+/,
                                      message: 'Invalid Email'
                                    }
                         }}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      innerRef={field.ref} 
                      type='email'
                      placeholder='john@example.com'
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                     
                />
                {errors.loginEmail && <span className='text-danger'>{errors.loginEmail.message}</span>}

                  {/* <Input type='text' placeholder='Email'></Input> */}
                </Col>
            </Row>
              <Button color='primary' block disabled={loading}>
              {loading && <Spinner size="sm" className='me-50'/>}  Sign up
              </Button>
            </Form>
            {/* <p className='text-center mt-2'>
              <span className='me-25'>Already have an account?</span>
              <Link to='/login'>
                <span>Sign in instead</span>
              </Link>
            </p> */}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default RegisterBasic
