// ** React Imports
import { Link, useParams } from 'react-router-dom'

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub, Coffee, X } from 'react-feather'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'
import apiConfig from '@configs/apiConfig'
// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Input, Button } from 'reactstrap'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Avatar from '@components/avatar'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { useEffect, useState } from 'react'

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

const MailVerification = () => {
  const [message, setMessage] = useState('')
  const {token} = useParams()
  console.log(token)

  const verifyMail = () => {
    const config = {
      method: 'post',
      url: `${apiConfig.api.url}auth/email_confirmation`,
      headers: { 
        ContentType: 'application/json',
        Authorization: `Token ${token}`
      }
      
      // data: { name: data.name, email: data.email, password: data.password }
    }

    axios(config)
    .then(function (res) {
      console.log(res)
      if (res.data.status === 200) {
        setMessage(res.data.message)
      } else if (res.data.status === 400) {
        setMessage(res.data.message)
      }
    }).catch(err => console.log(err))
  }

  useEffect(() => {
    verifyMail()
  }, [])

  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        {message &&
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              
              <h2 className='brand-text text-primary ms-1 text-center'>Verified!</h2>

            </Link>
            
            <p className='text-center mt-2'>
            <h5 className='me-25'>{message}</h5>
              {/* <span className='me-25'>Login</span> */}
              <Link to='/login'>
                <span>Login</span>
              </Link>
            </p>
            
          </CardBody>
        </Card>
        }
      </div>
    </div>
  )
}

export default MailVerification
