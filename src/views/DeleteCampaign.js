import React, {useState, useEffect} from 'react'
import { Modal, ModalHeader, ModalFooter, ModalBody, Button, Row, Col, Form, Label, Spinner } from 'reactstrap'
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
const DeleteCampaign = ({deleteModal, deleteUrl, setDeleteModal}) => {
    const token = getToken()
    const form = useForm()
    const [loading, setLoading] = useState(false)
    const [optionsLoading, setOptionsLoading] = useState(false)
    const [postOptions, setPostOptions] = useState([])
    const {
      control,
      handleSubmit,
    //   setValue,
      formState: { errors }
    } = form
    // const postOptions = [{label:'Active', value:1}, {label:'Inactive', value:2}]

    const deletePost = (data) => {
        console.log('data', data, deleteUrl)
        setLoading(true)
        const id = data.post.map((item) => item.value)
        console.log('id-arr', id)
        const config = {
            method: 'delete',
            url: `${apiConfig.api.url}delete_posts`,
            data:{site_url:deleteUrl, post_id:id },
            headers: { 
              Authorization: `Token ${token}`
            }
          }
          axios(config).then((response) => {
            console.log('response', response)
            setLoading(false)
            if (response.data.status === 200) {
                setDeleteModal(false)
                toast.success(<ToastContent message={response.data.message} />, { duration:3000 })  
            } else {
                toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
            }
          }).catch((error) => {
            toast.error(<ToastContent message={error.message} />, { duration:3000 })  
          })
    }
    const getPosts = () => {
        setOptionsLoading(true)
        const config = {
            method: 'post',
            url: `${apiConfig.api.url}list_posts`,
            data:{site_url:deleteUrl },
            headers: { 
              Authorization: `Token ${token}`
            }
          }
          axios(config).then((response) => {
            console.log('response', response)
            setOptionsLoading(false)
            if (response.data.status === 200) {
               setPostOptions(response.data.data)
            } else {
                setPostOptions([])
                toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
            }
          }).catch((error) => {
            setOptionsLoading(false)
            toast.error(<ToastContent message={error.message} />, { duration:3000 })  
          })
    }
    useEffect(() => {
     if (deleteModal) {
      getPosts()
     }
    }, [deleteModal])
  return (
    <div>
      <Modal isOpen={deleteModal} size="lg" toggle={close}>
        <ModalHeader toggle={() => setDeleteModal(false)}> </ModalHeader>
        <Form onSubmit={handleSubmit(deletePost)}>
        <ModalBody className='p-3'>
            <div className='mb-1'>
            <div className='mb-1 d-flex justify-content-center'>
                <h2>Delete Posts</h2>
            </div>
            </div>
            <Row className='mb-1'>
                <Col>
                  <Label>Select Posts to Delete</Label>
                  <Controller
                  control={control}
                  name="post"
                  rules={{ required: "Please Select a Post" }}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        isMulti
                        autoFocus
                        isLoading={optionsLoading}
                        placeholder={optionsLoading ? 'Loading...' : 'Select..'}
                        options={postOptions}
                        id="post"
                        invalid={errors.post}
                        onChange={(event) => {
                          field.onChange(event)
                        }}
                      ></Select>
                      {errors.post && (
                        <p className="text-danger">{errors.post.message}</p>
                      )}
                    </>
                  )}
                />
                </Col>
            </Row>
         
         
        </ModalBody>
        <ModalFooter className='d-flex justify-content-center'>
            <Button color='primary' type="submit" disabled={loading}>{loading && <Spinner size="sm" className='me-50' />} Submit</Button>
            <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
        </ModalFooter>
        </Form>
      </Modal> 
    </div>
  )
}

export default DeleteCampaign
