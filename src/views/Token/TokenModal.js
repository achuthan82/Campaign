import React, {useState, useEffect} from 'react'
import {Button, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter, Label, Input, Form, Spinner } from 'reactstrap'
import { useForm, Controller } from "react-hook-form"
import apiConfig from '@configs/apiConfig'
import axios from "axios"
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
const TokenModal = ({modalOpen, setModalOpen, getTokenData, editData, setEditData}) => {
    const token = getToken()
    const [loading, setLoading] = useState(false)
    const form = useForm()
    const {
      control,
      handleSubmit,
      setValue,
    //   setError,
    reset,
      formState: { errors }
    } = form
  const close = () => {
    setModalOpen(false)
    setValue('token_name', '')
    setValue('token_code', '')
    setValue('token_data', '')
    setEditData(null)
    reset() 
  }
  useEffect(() => {
    if (modalOpen && editData !== null) {
     setValue('token_name', editData.token_name)
     setValue('token_code', editData.token_code)
     setValue('token_data', editData.token_data)
    } else {
        reset()
        setValue('token_name', '')
        setValue('token_code', '')
        setValue('token_data', '') 
    }
 }, [modalOpen])
  const addToken = (details) => {
    setLoading(true)
     const config = {
        method: 'post',
        url: `${apiConfig.api.url}add_token`,
        data: {token_name: details.token_name, token_code: details.token_code, token_data: details.token_data, id: editData === null ? '' : editData.id},
        headers: { 
            Authorization: `Token ${token}`
          }
    }
    axios(config).then((response) => {
        setLoading(false)
        console.log('response', response)
        if (response.data.status === 200) {
            toast.success(<ToastContent message={response.data.message} />, { duration:3000 }) 
            setEditData(null)
            getTokenData() 
            setModalOpen(false)
            setValue('token_name', '')
            setValue('token_code', '')
            setValue('token_data', '') 
        } else {
            toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
        }
    }).catch((error) => {
        setValue('token_name', '')
        setValue('token_code', '')
        setValue('token_data', '') 
        setModalOpen(false)
        setLoading(false)
        toast.error(<ToastContent message={error.message} />, { duration:3000 })  
    })
    
  }
  return (
    <div>
      <Modal isOpen={modalOpen} size="md" toggle={close}>
        <ModalHeader toggle={close}> </ModalHeader>
        <Form onSubmit={handleSubmit(addToken)}>
        <ModalBody className='p-3'>
            <div className='mb-1'>
            <div className='mb-1 d-flex justify-content-center'>
                <h2>{editData === null ? 'Create New Token' : 'Edit Token' }</h2>
            </div>
            </div>
        
            <Row className='mb-1'>
                <Col>
                  <Label>Token Name<span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="token_name"
                  rules={{ required: "First Name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref} 
                      autoFocus
                      type="text"
                      id="token_name"
                      invalid={errors.token_name}
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
                  <Label>Token Code<span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="token_code"
                  rules={{ required: "Token Code is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref} 
                      autoFocus
                      type="text"
                      id="token_name"
                      invalid={errors.token_code}
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
                  <Label>Token Data<span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="token_data"
                  rules={{ required: "Token Code is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref} 
                      autoFocus
                      type="textarea"
                      id="token_data"
                      invalid={errors.token_data}
                    />
                  )}
                />
                {errors.first_name && (
                  <p className="text-danger">{errors.first_name.message}</p>
                )}
                </Col>
            </Row>
        </ModalBody>
        <ModalFooter className='d-flex justify-content-center'>
            <Button color='primary' disabled={loading}>{loading && <Spinner size="sm" className='me-50'/>} Submit</Button>
            <Button onClick={close} type='reset'>Cancel</Button>
        </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

export default TokenModal
