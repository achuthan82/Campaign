import React, {useEffect, useState} from 'react'
import { Modal, ModalBody, ModalHeader, Row, Col, Label, Input, ListGroup, ListGroupItem, Button, ModalFooter, Form, Spinner } from 'reactstrap'
import Select from 'react-select'
import { useForm, Controller } from "react-hook-form"
import apiConfig from '../configs/apiConfig'
import axios from 'axios'
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


const KeyEditModal = ({keyModal, setKeyModal, aiDetails, getOpenApi}) => {

  const token = getToken()
  const [loading, setLoading] = useState(false)
  const form = useForm()
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = form
  const statusOptions = [{label:'Active', value:true}, {label:'Inactive', value:false}]
  useEffect(() => {
    if (aiDetails !== null) {
      const statusId = statusOptions.findIndex(
        (item) => item.value === aiDetails.selected_status
      )
     setValue('name', aiDetails.name)
     setValue('api_key', aiDetails.openai_api_key)
     setValue('status', statusOptions[statusId])
    } else {
      setValue('name', '')
      setValue('api_key', '')
      setValue('status', null)
    }
 }, [keyModal])
 
  const addOrEditKey = (details) => {

     setLoading(true)
     const api = aiDetails !== null && details.name === aiDetails.name ? `${apiConfig.api.url}edit_openai_api_key` : `${apiConfig.api.url}add_openai_api_key`
     const m = aiDetails !== null && details.name === aiDetails.name ? 'put' : 'post'
     const config = {
      method: m,
      url: api,
      data:{name:details.name, selected_status:details.status.value, openai_api_key:details.api_key.replace(/\s+/g, ' ') },
      headers: { 
        Authorization: `Token ${token}`
      }
    }
    axios(config).then((response) => {
      setLoading(false)
      if (response.data.status === 200) {
        getOpenApi()
        toast.success(<ToastContent message={response.data.message} />, { duration:3000 })  
        setKeyModal(false)
      } else {
        toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
      }
    }).catch((error) => {
      setLoading(false)
      toast.error(<ToastContent message={error.message} />, { duration:3000 })  
    })
  }
  return (
    <div>
       <Modal isOpen={keyModal} size="lg" toggle={() => setKeyModal(!keyModal)}>
        <ModalHeader toggle={() => setKeyModal(!keyModal)}> </ModalHeader>
        <Form onSubmit={handleSubmit(addOrEditKey)}>
        <ModalBody className='p-3'>
            <div className='mb-1'>
            <div className='mb-1 d-flex justify-content-center'>
                <h2>Add/Edit Open AI Key</h2>
            </div>
            </div>
            <Row className='mb-1'>
                <Col>
                  <Label>Name <span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref} 
                      autoFocus
                      type="text"
                      placeholder='Name'
                      id="name"
                      invalid={errors.name}
                    />
                  )}
                />
            {errors.name && <p className='text-danger'>{errors.name.message}</p>}
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Open AI Key <span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="api_key"
                  rules={{ required: "API key is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref} 
                      autoFocus
                      type="textarea"
                      placeholder='412qw34-1w2we34-345we24-qwe78qwe'
                      id="api_key"
                      invalid={errors.api_key}
                    />
                  )}
                />
                {errors.api_key && <p className='text-danger'>{errors.api_key.message}</p>}

                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Select Status <span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="status"
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        autoFocus
                        options={statusOptions}
                        id="status"
                        invalid={errors.status}
                        onChange={(event) => {
                          field.onChange(event)
                        }}
                      ></Select>
                      {errors.status && (
                        <p className="text-danger">{errors.status.message}</p>
                      )}
                    </>
                  )}
                />
                </Col>
            </Row>
         
         
        </ModalBody>
        <ModalFooter className='d-flex justify-content-center'>
            <Button color='primary' type="submit" disabled={loading}>{loading && <Spinner size="sm" className='me-50' />}Submit</Button>
            <Button onClick={() => setKeyModal(!keyModal)}>Cancel</Button>

        </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

export default KeyEditModal
