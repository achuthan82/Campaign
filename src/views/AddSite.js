import React, {useState, useEffect} from 'react'
import { Modal, ModalBody, ModalHeader, Row, Col, Label, Input, Form, Button, ModalFooter, Spinner } from 'reactstrap'
import Select from 'react-select'
import { useForm, Controller } from "react-hook-form"
import apiConfig from '../configs/apiConfig'
import axios from 'axios'
import { getToken } from '@utils'
import { toast } from 'react-hot-toast'
import InputPasswordToggle from '@components/input-password-toggle'


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
const AddSite = ({siteModal, setSiteModal, getSiteDetails, editData, setEditData, setSearchValue, setCurrentPage, rowsPerPage}) => {
  const token = getToken()
  const form = useForm()
  const [loading, setLoading] = useState(false)
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = form
  const statusOptions = [{label:'Active', value:1}, {label:'Inactive', value:2}]
  const addOrEditSite = (details) => {
    console.log('data', details)
    setLoading(true)
    const config = {
      method: editData === null ? 'post' : 'put',
      url: editData === null ? `${apiConfig.api.url}site_settings` : `${apiConfig.api.url}site_settings/${editData.id}`,
      data:{site_name:details.name, site_url:details.url, site_status:details.status.label, username:details.user_name, application_password:details.password },
      headers: { 
        Authorization: `Token ${token}`
      }
    }
    axios(config).then((response) => {
      setLoading(false)
      if (response.data.status === 200) {
        toast.success(<ToastContent message={response.data.message} />, { duration:3000 }) 
        setCurrentPage(0)
        getSiteDetails(1, rowsPerPage, '') 
        setEditData(null)
        setSiteModal(false)
        setValue('name', '')
        setValue('url', '')
        setValue('status', null)
        setValue('user_name', '')
        setValue('password', '')
        setSearchValue('')
      } else {
        toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
      }
    }).catch((error) => {
      setLoading(false)
      toast.error(<ToastContent message={error.message} />, { duration:3000 })  
    })
  }
  const close = () => {
    setValue('name', '')
    setValue('url', '')
    setValue('status', '')
    setValue('user_name', '')
    setValue('password', '')
    setEditData(null)
    setSiteModal(false)
  }
  useEffect(() => {
    if (editData !== null && siteModal) {
      const statusId =  statusOptions.findIndex(
        (item) => item.label === editData.site_status
      )
      setValue('name', editData.site_name)
      setValue('url', editData.site_url)
      setValue('status', statusOptions[statusId])
      setValue('user_name', editData.username)
      setValue('password', editData.application_password)
    }

  }, [siteModal])
 
  return (
    <div>
       <Modal isOpen={siteModal} size="lg" toggle={close}>
        <ModalHeader toggle={close}> </ModalHeader>
        <Form onSubmit={handleSubmit(addOrEditSite)}>
        <ModalBody className='p-3'>
            <div className='mb-1'>
            <div className='mb-1 d-flex justify-content-center'>
                <h2>{ editData === null ? 'Add New Site' : 'Edit Site' }</h2>
            </div>
            </div>
            <Row className='mb-1'>
                <Col>
                  <Label> Site name <span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="name"
                  rules={{ required: "Site Name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref} 
                      autoFocus
                      type="text"
                      placeholder='Site name'
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
                  <Label> Site Url <span className='text-danger'>*</span></Label>
                  <Controller
                      name="url"
                      control={control}
                      render={({ field }) => (
                        <Input type="text" {...field} placeholder="Enter URL" />
                      )}
                      rules={{
                        required: 'URL is required'
                        // pattern: {
                        //   value: /^(ftp|http|https):\/\/[^ "]+\.com(\/|$)$/,
                        //   message: 'Invalid URL format'
                        // }
                      }}
                    />
                  {errors.url && <p className='text-danger'>{errors.url.message}</p>}

                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>User Name <span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="user_name"
                  rules={{ required: "User Name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref} 
                      autoFocus
                      type="text"
                      // placeholder='412qw34-1w2we34-345we24-qwe78qwe'
                      id="user_name"
                      invalid={errors.user_name}
                    />
                  )}
                />
                {errors.user_name && <p className='text-danger'>{errors.user_name.message}</p>}
                </Col>
            </Row>
            <Row className='mb-1'>
             <Col>
             <Label>Password <span className='text-danger'>*</span></Label>
             <Controller
                  id='password'
                  name='password'
                  control={control}
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
                {errors.password && <span className='text-danger'>Password is required</span>}

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
            <Button color='primary' type="submit" disabled={loading}>{loading && <Spinner size="sm" className='me-50' />} Submit</Button>
            <Button onClick={close}>Cancel</Button>
        </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

export default AddSite
