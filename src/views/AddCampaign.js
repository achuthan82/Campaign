import React, {useState, Fragment, useEffect} from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { Modal, ModalBody, ModalHeader, Row, Col, Label, Input, ListGroup, ListGroupItem, Button, ModalFooter, Form, Spinner } from 'reactstrap'
import { selectThemeColors, getToken } from '@utils'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

import { useForm, Controller } from "react-hook-form"
import { toast } from 'react-hot-toast'
import apiConfig from '../configs/apiConfig'

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
const AddCampaign = ({modalOpen, setModalOpen, editData, getCampaign, setEditData}) => {
    console.log(modalOpen)
    const form = useForm()
    const {
      control,
      handleSubmit,
      setValue,
      formState: { errors }
    } = form
    const token = getToken()
    const intervalOptions = [{label:'10 mins', value:10}, {label:'20 mins', value:20}]
    const [files, setFiles] = useState([])
    const [selected, setSelected] = useState([])
    const [siteOptions, setSiteOptions] = useState([])
    const [siteLoading, setSiteLoading] = useState(false)
    const [categoryLoading, setCategoryLoading] = useState(false)
    const [categoryModal, setCategoryModal] = useState(false)
    const [categoryOptions, setCategoryOptions] = useState([])
    const [loading, setLoading] = useState(false)
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: acceptedFiles => {
        console.log(acceptedFiles[0])
        setFiles([Object.assign(acceptedFiles[0])])
        // setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
      }
    })
  
    const renderFilePreview = file => {
      console.log('file', file)
      if (file.type && file.type.startsWith('image')) {
        return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
      } else {
        return <FileText size='28' />
      }
    }
  
    const handleRemoveFile = file => {
      const uploadedFiles = files
      const filtered = uploadedFiles.filter(i => i.name !== file.name)
      setFiles([...filtered])
    }
  
    const renderFileSize = size => {
      if (Math.round(size / 100) / 10 > 1000) {
        return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
      } else {
        return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
      }
    }
  
    const fileList = files.map((file, index) => (
      <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
        <div className='file-details d-flex align-items-center'>
          <div className='file-preview me-1'>{renderFilePreview(file)}</div>
          <div>
            <p className='file-name mb-0'>{file.name}</p>
            <p className='file-size mb-0'>{file.size && renderFileSize(file.size)}</p>
          </div>
        </div>
        <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
          <X size={14} />
        </Button>
      </ListGroupItem>
    ))
  
    // const handleRemoveAllFiles = () => {
    //   setFiles([])
    // }
    const addOrEditCampaign = (data) => {
      setLoading(true)
      console.log('data', data)
      const formData = new FormData()
      const categoryData = data.category.map((item) => {
        return item.label
      })
      formData.append("questions", data.questions)
      formData.append("prompt", data.prompt)
      formData.append("post_title", data.title)
      formData.append("post_content", data.content)
      formData.append("settings_id", data.site.value)
      formData.append("post_interval", data.interval.value)
      formData.append("add_category", categoryData)
      console.log('files', files)
      files.map((fl, idx) => {
        formData.append(`file${idx + 1}`, fl)
      })
      
      const config = {
        method: editData === null ? 'post' : 'put',
        url: editData === null ?  `${apiConfig.api.url}campaign` : `${apiConfig.api.url}campaign/${editData.id}`,
        data:formData,
        headers: { 
          ContentType: "multipart/form-data",
          Authorization: `Token ${token}`
        }
      }
      axios(config).then((response) => {
        console.log('response', response)
        setLoading(false)
        if (response.data.status === 200) {
          toast.success(<ToastContent message={response.data.message} />, { duration:3000 })
          setValue('content', '')
          setValue('questions', '')
          setValue('prompt', '')
          setValue('title', '')
          setValue('interval', null)
          setValue('site', null)
          setValue('category', null)
          setEditData(null)
          setModalOpen(false) 
          getCampaign()
        } else {
          toast.error(<ToastContent message={response.data.message} />, { duration:3000 })
        }
      }).catch((error) => {
        setLoading(false)
        toast.error(<ToastContent message={error.message} />, { duration:3000 })
      })
    }
    const getSiteDetails = () => {
      setSiteLoading(true)
      const config = {
        method: 'get',
        url: `${apiConfig.api.url}site_settings`,
        headers: { 
          Authorization: `Token ${token}`
        }
      }
      axios(config).then((response) => {
        console.log('response', response)
        setSiteLoading(false)
        if (response.data.status === 200) {
          const formatData = response.data.data.map((item) => {
            return {label: item.site_name, value:item.id}
          })
          setSiteOptions(formatData)
          console.log('site data', formatData)
        } else if (response.data.status === 204) {
          setSiteOptions([])
        } else {
          toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
        }
      }).catch((error) => {
        setSiteLoading(false)
        toast.error(<ToastContent message={error.message} />, { duration:3000 })  
      })
    }
    const getCategoryDetails = () => {
      setCategoryLoading(true)
      const config = {
        method: 'get',
        url: `${apiConfig.api.url}category`,
        headers: { 
          Authorization: `Token ${token}`
        }
      }
      axios(config).then((response) => {
        console.log('response', response)
        setCategoryLoading(false)
        if (response.data.status === 200) {
          setCategoryOptions(response.data.data)
        } else if (response.data.status === 204) {
          setCategoryOptions([])
        } else {
          toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
        }
      }).catch((error) => {
        setCategoryLoading(false)
        setSiteLoading(false)
        toast.error(<ToastContent message={error.message} />, { duration:3000 })  
      })
    }
    useEffect(() => {
      if (modalOpen) {
      getSiteDetails()
      getCategoryDetails()
      if (editData !== null) {
        const intervalId =  intervalOptions.findIndex(
          (item) => item.value === editData.post_interval
        )
        setValue('content', editData.post_content)
        setValue('questions', editData.questions)
        setValue('prompt', editData.prompt)
        setValue('title', editData.post_title)
        setValue('interval', intervalOptions[intervalId])
        const fileDetails =  {
          path: 'Credit Card bill.pdf',
          name: 'Uploaded Image',
          lastModified: Date.now(),
          lastModifiedDate: new Date(),
          size: 81946,
          type: 'application/pdf',
          webkitRelativePath: ''
        }
        const blob = new Blob([''], { type: fileDetails.type })

    // Create a File object with the Blob and file details
    const customFile = new File([blob], fileDetails.name, {
      lastModified: fileDetails.lastModified,
      type: fileDetails.type
    })

    setFiles([customFile])
      }
    }
    }, [modalOpen])

  
    useEffect(() => {
       if (siteOptions.length > 0 && editData !== null) {
        const siteId =  siteOptions.findIndex(
          (item) => item.value === editData.settings_id
        )
        setValue('site', siteOptions[siteId])
       }
    }, [modalOpen, siteOptions.length])
    useEffect(() => {
      if (categoryOptions.length > 0  && editData !== null) {
        const categoryId =  editData.category_info.map((item) => {
          return categoryOptions[categoryOptions.findIndex((data) => data.value === item.category_id)]
        })
        setValue('category', categoryId)
      }

    }, [modalOpen, categoryOptions.length])
    const close = () => {
      setModalOpen(false)
      setValue('content', '')
      setValue('questions', '')
      setValue('prompt', '')
      setValue('title', '')
      setValue('interval', null)
      setValue('site', null)
      setValue('category', null)
      setFiles([])
    }
  return (
    <div>
      <Modal isOpen={modalOpen} size="lg" toggle={close}>
        <ModalHeader toggle={close}> </ModalHeader>
        <Form onSubmit={handleSubmit(addOrEditCampaign)}>
        <ModalBody className='p-3'>
            <div className='mb-1'>
            <div className='mb-1 d-flex justify-content-center'>
                <h2>Create New Campaign</h2>
            </div>
            <div className='d-flex justify-content-center'>
                <h5>Add New campaign </h5>
            </div>
            </div>
            <Row className='mb-1'>
                <Col>
                <Label>Choose Site</Label>
                <Controller
                  control={control}
                  name="site"
                  rules={{ required: "Site details is required" }}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        isLoading={siteLoading}
                        placeholder={siteLoading ? 'Loading...' : 'Select..'}
                        autoFocus
                        options={siteOptions}
                        id="site"
                        invalid={errors.site}
                        onChange={(event) => {
                          field.onChange(event)
                        }}
                      ></Select>
                      {errors.site && (
                        <p className="text-danger">{errors.site.message}</p>
                      )}
                    </>
                  )}
                />
              </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Add Questions</Label>
                  <Controller
                  control={control}
                  name="questions"
                  rules={{ required: "This field is mandatory" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref}
                      autoFocus
                      type="textarea"
                      id="questions"
                      placeholder='Question one per line'
                      invalid={errors.questions}
                    />
                  )}
                />
                 {errors.questions && (<p className="text-danger">{errors.questions.message}</p>)}
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <div className='d-flex justify-content-between'>
                   <Label>Categories</Label>
                   <h6 className='card-text-log'>Create Categories if not existing</h6>
                  </div>
                  <Controller
                  control={control}
                  name="category"
                  rules={{ required: "Category details is required" }}
                  render={({ field }) => (
                    <>
                      <CreatableSelect
                        theme={selectThemeColors}
                        isLoading={categoryLoading}
                        placeholder={categoryLoading ? 'Loading...' : 'Select..'}
                        isMulti
                        {...field}
                        autoFocus
                        options={categoryOptions}
                        id="category"
                        invalid={errors.category}
                        onChange={(event) => {
                          field.onChange(event)
                        }}
                      ></CreatableSelect>
                      {errors.category && (
                        <p className="text-danger">{errors.category.message}</p>
                      )}
                    </>
                  )}
                />
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Prompt</Label>
                  <Controller
                  control={control}
                  name="prompt"
                  rules={{ required: "This field is mandatory" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref}
                      autoFocus
                      type="textarea"
                      id="prompt"
                      placeholder='Add prompt here..'
                      invalid={errors.prompt}
                    />
                  )}
                />
                 {errors.prompt && (<p className="text-danger">{errors.prompt.message}</p>)}
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Post Title</Label>
                  <Controller
                  control={control}
                  name="title"
                  rules={{ required: "This field is mandatory" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref}
                      autoFocus
                      type="text"
                      id="title"
                      placeholder='Post Title'                      
                      invalid={errors.title}
                    />
                  )}
                />
              {errors.title && (<p className="text-danger">{errors.title.message}</p>)}
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Post Content</Label>
                  <Controller
                  control={control}
                  name="content"
                  rules={{ required: "This field is mandatory" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref}
                      autoFocus
                      type="textarea"
                      id="content"
                      placeholder='Add Post Content here..'                      
                      invalid={errors.content}
                    />
                  )}
                />
                {errors.content && (<p className="text-danger">{errors.content.message}</p>)}

                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Post Interval</Label>
                  <Controller
                  control={control}
                  name="interval"
                  rules={{ required: "Interval details is required" }}
                  render={({ field }) => (
                    <>
                      <Select
                        theme={selectThemeColors}
                        {...field}
                        autoFocus
                        options={intervalOptions}
                        id="interval"
                        invalid={errors.interval}
                        onChange={(event) => {
                          field.onChange(event)
                        }}
                      ></Select>
                      {errors.interval && (
                        <p className="text-danger">{errors.interval.message}</p>
                      )}
                    </>
                  )}
                />
                </Col>
            </Row>
            <Row>
                <Col>
                <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className='d-flex align-items-center justify-content-center flex-column'>
            <DownloadCloud size={64} />
            <h5>Drop Files here or click to upload</h5>
            <p className='text-secondary'>
              Drop files here or click{' '}
              <a href='/' onClick={e => e.preventDefault()}>
                browse
              </a>{' '}
              thorough your machine
            </p>
          </div>
        </div>
                </Col>
            </Row>
            {files.length ? (
          <Fragment>
            <ListGroup className='my-2'>{fileList}</ListGroup>
            {/* <div className='d-flex justify-content-end'>
              <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                Remove All
              </Button>
            </div> */}
          </Fragment>
        ) : null}
        </ModalBody>
        <ModalFooter className='d-flex justify-content-center'>
            <Button color='primary' type="submit" disabled={loading}>{loading && <Spinner size="sm" className='me-50' />} Submit</Button>
            <Button onClick={close}>Cancel</Button>

        </ModalFooter>
        </Form>
      </Modal>
      <Modal isOpen={categoryModal} toggle={() => setCategoryModal(false)} size='md'>
        <ModalHeader toggle={() => setCategoryModal(false)}></ModalHeader>
        <ModalBody className='p-3'>
            <div className='mb-1 d-flex justify-content-center'>
                <h2>Add/Edit Categories</h2>
            </div>
            <Row>
                <Col>
                <Label>Add Categories here..</Label>
                <TagsInput value={selected} onChange={setSelected} name="Categories" inputProps={{placeholder: ""}} ></TagsInput>
                <small>Type and enter to add categories</small>
                </Col>
            </Row>
        </ModalBody>
        <ModalFooter className='py-2 d-flex justify-content-center'>
            <Button color='primary' type="submit" disabled={loading}>{loading && <Spinner size="sm" className='me-50' />}Submit</Button>
            <Button onClick={() => setCategoryModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AddCampaign
