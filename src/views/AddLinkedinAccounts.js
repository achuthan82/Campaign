import React, {useState} from "react"
import {
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Col,
  Label,
  Input,
  Form,
  Button,
  ModalFooter,
  Spinner
} from "reactstrap"
import { useForm, Controller } from "react-hook-form"
import axios from 'axios'
import apiConfig from '../configs/apiConfig'
import { getToken } from '@utils'
import { toast } from 'react-hot-toast'

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
const AddLinkedinAccounts = ({ linkedinModal, setLinkedinModal }) => {
  const form = useForm()
  const token = getToken()
  const [loading, setLoading] = useState(false)
  console.log(loading)
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = form
  const addAccount = (data) => {
     setLoading(true)
     console.log('data', data)
     const config = {
      method: 'post',
      url:  `${apiConfig.api.url}linkedin/add-account`,
      data:{email:data.loginEmail},
      headers: { 
        Authorization: `Token ${token}`
      }
    }
    axios(config).then((response) => {
      console.log('response', response)
      if (response.data.status === 200) {
          window.location.href = response.data.redirect_url

      } else {
        setLoading(false)
        toast.error(<ToastContent message={response.data.message} />, { duration:3000 }) 
      }
    }).catch((error) => {
      setLoading(false)
      toast.error(<ToastContent message={error.message} />, { duration:3000 }) 
    })
  }
  const close = () => {
    setLinkedinModal(false)
    setValue('loginEmail', '')
  }
  return (
    <div>
      <Modal isOpen={linkedinModal} size="sm" toggle={close} centered>
        <ModalHeader toggle={close}> </ModalHeader>
        {/* <Form> */}
          <Form onSubmit={handleSubmit(addAccount)}>
          <ModalBody className="p-3">
            <div className="mb-1">
              <div className="mb-1 d-flex justify-content-center">
                <h4 className="fw-bolder">Add Account</h4>
              </div>
            </div>
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
                      placeholder='Email address associated with your LinkedIn account'
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                     
                />
                {errors.loginEmail && <span className='text-danger'>{errors.loginEmail.message}</span>}

                  {/* <Input type='text' placeholder='Email'></Input> */}
                </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="d-flex justify-content-center">
            <Button color="primary" type='submit' disabled={loading}>{loading && <Spinner size="sm" className='me-50' />}Add</Button>
            <Button color="secondary" onClick={close}>Cancel</Button>
            {/* <Button color='primary' type="submit" disabled={loading}>{loading && <Spinner size="sm" className='me-50' />} Submit</Button>
            <Button onClick={close}>Cancel</Button> */}
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

export default AddLinkedinAccounts
