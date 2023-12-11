import React, {useState} from 'react'
import {Button, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter, Label, Input, Form, Spinner } from 'reactstrap'
import Select from "react-select"
import { useForm, Controller } from "react-hook-form"
import apiConfig from '../../configs/apiConfig'
import axios from 'axios'
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
const AddUser = ({modalOpen, setModalOpen}) => {
  const [loading, setLoading] = useState(false)
  const roleOptions = [{label:'Admin', value:1}, {label:'Agent', value:2}]
  const form = useForm()
  const {
    control,
    handleSubmit,
    // setValue,
    formState: { errors }
  } = form
  const addUser = (data) => {
    console.log('data', data)
    setLoading(true)
    const config = {
        method: 'post',
        url: `${apiConfig.api.url}user`,
       
        data: { email: data.loginEmail,
            first_name: data.first_name, 
            last_name:data.last_name, 
            role_id:data.role.value
        }
      }
    axios(config).then((response) => {
        setLoading(false)
        console.log('response', response)
        if (response.data.status === 200) {
            toast.success(<ToastContent message={response.data.message} />, { duration:3000 })  
            setModalOpen(false)
        } else {
            toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
        }
    }).catch(() => {
        setLoading(false)
        toast.error(<ToastContent message='Network Error' />, { duration:3000 })  
 
    })
  }
  return (
    <div>
      <Modal isOpen={modalOpen} size="md" toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}> </ModalHeader>
        <Form onSubmit={handleSubmit(addUser)}>
        <ModalBody className='p-3'>
            <div className='mb-1'>
            <div className='mb-1 d-flex justify-content-center'>
                <h2>Create New User</h2>
            </div>
            </div>
        
            <Row className='mb-1'>
                <Col>
                  <Label>First Name</Label>
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
                  <Label>Last Name</Label>
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
                  <Label>Email</Label>
                  <Controller
                  id='loginEmail'
                  name='loginEmail'
                  control={control}
                  rules={{ required: "Email is required" }}
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
        
            <Row className='mb-1'>
                <Col>
                  <Label>Role</Label>
                  <Controller
                  control={control}
                  name="role"
                  rules={{ required: "Role is required" }}
                  // defaultValue={editFlag && editData !== null ? voiceOptions[voiceId] : null}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        autoFocus
                        options={roleOptions}
                        id="role"
                        invalid={errors.role}
                        onChange={(event) => {
                          field.onChange(event)
                        }}
                      ></Select>
                      {errors.role && (
                        <p className="text-danger">{errors.role.message}</p>
                      )}
                    </>
                  )}
                />
                </Col>
            </Row>
        </ModalBody>
        <ModalFooter className='d-flex justify-content-center'>
            <Button color='primary' disabled={loading}>{loading && <Spinner size="sm" className='me-50'/>} Submit</Button>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>

        </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

export default AddUser
