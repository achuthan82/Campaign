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
const AddCampaign = ({modalOpen, setModalOpen, editData, getCampaign, setEditData, setSearchValue, setCurrentPage, rowsPerPage}) => {
    console.log(modalOpen)
    const form = useForm()
    const {
      control,
      handleSubmit,
      setValue,
      formState: { errors }
    } = form
    const token = getToken()
    const intervalOptions = [{label:'None', value:0}, {label:'15 mins', value:15}, {label:'30 mins', value:30}, {label:'1 hour', value:1}, {label:'12 hours', value:12}, {label:'6 hours', value:6}, {label:'24 hours', value:24}, {label:'72 hours', value:72}]
    const [files, setFiles] = useState([])
    const [selected, setSelected] = useState([])
    const [siteOptions, setSiteOptions] = useState([])
    const [siteLoading, setSiteLoading] = useState(false)
    const [categoryLoading, setCategoryLoading] = useState(false)
    const [categoryModal, setCategoryModal] = useState(false)
    const [categoryOptions, setCategoryOptions] = useState([])
    const [loading, setLoading] = useState(false)
    const [uploadedImage, setUploadedImage] = useState('')
    const [questions, setQuestions] = useState('')
    const [formatQuestions, setFormatQuestion] = useState([])
    const [siteUrl, setSiteUrl] = useState('')
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: acceptedFiles => {
        console.log(acceptedFiles[0])
        setUploadedImage('')
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
      console.log('questions', formatQuestions.join('$'))
      setLoading(true)
      console.log('data', data)
      const formData = new FormData()
      const categoryData = data.category.map((item) => {
        return item.value
      })
      const categoryName = data.category.map((item) => {
        return item.label
      })
      // formData.append("questions", formatQuestions.length > 0 ? formatQuestions.join('$$') : questions)
      formData.append("questions", questions)
      formData.append("prompt", data.prompt)
      formData.append("post_title", data.title)
      formData.append("campaign_title", data.campaign_title)
      formData.append("post_content", data.content)
      formData.append("settings_id", data.site.value)
      formData.append("post_interval", data.interval.value)
      formData.append("category_id", categoryData)
      formData.append("add_category", categoryName)
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
          setQuestions('')
          setEditData(null)
          setModalOpen(false) 
          setSearchValue('')
          setCurrentPage(0)
          getCampaign(1, rowsPerPage, '')
          setFiles([])
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
            return {label: item.site_name, value:item.id, url:item.site_url}
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
        method: 'post',
        url: `${apiConfig.api.url}category`,
        headers: { 
          Authorization: `Token ${token}`
        },
        data : {site_url: siteUrl}
      }
      axios(config).then((response) => {
        console.log('response', response)
        setCategoryLoading(false)
        if (response.data.status === 200) {
          setCategoryOptions(response.data.data)
        } else if (response.data.status === 204) {
          setCategoryOptions([])
          toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
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
      // getCategoryDetails()
      if (editData !== null) {
        console.log('editData', editData)
        const intervalId =  intervalOptions.findIndex(
          (item) => item.value === editData.post_interval
        )
        setValue('content', editData.post_content)
        setValue('questions', editData.questions)
        setQuestions(editData.questions)
        setValue('prompt', editData.prompt)
        setValue('title', editData.post_title)
        setValue('interval', intervalOptions[intervalId])
        setSiteUrl(editData.site_url)
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
    console.log('uploaded image', editData.url)
    setFiles([customFile])
    setUploadedImage(editData.url)

      } else {
        setUploadedImage('')
        setQuestions('')
        setFormatQuestion([])
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
      if (siteUrl !== '') {
      getCategoryDetails()
      }
    }, [siteUrl])
    const handleKeyDown = (event, currentQuestion) => {
      if (event.code === "Enter") {
        const questionParts = currentQuestion.split('\n')
        const data = [...formatQuestions, questionParts[questionParts.length - 1]]
        console.log('data', data)
        setFormatQuestion(data)
      }
    }
    useEffect(() => {
      if (categoryOptions.length > 0  && editData !== null) {
        console.log('category-options', categoryOptions)
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
      setSiteUrl('')
      setEditData(null)
      setFiles([])
      setUploadedImage('')
      setFormatQuestion([])
      setQuestions('')
    }
    useEffect(() => {
      console.log('questions', questions)
    }, [questions])
    const siteChange = (event) => {
      console.log('site-event', event)
      setSiteUrl(event.url)
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
                <Label>Choose Site<span className='text-danger'>*</span></Label>
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
                          siteChange(event)
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
                  <Label>Add Questions <span className='text-danger'>*</span></Label>
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
                      onChange={(event) => {
                         setQuestions(event.target.value)                           
                        field.onChange(event)
                      }}
                      onKeyDown={(event) => handleKeyDown(event, field.value)}
                    />
                  )}
                />
                 {errors.questions && (<p className="text-danger">{errors.questions.message}</p>)}
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <div className='d-flex justify-content-between'>
                   <Label>Categories<span className='text-danger'>*</span></Label>
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
                      {
                        siteUrl === '' && <p className='text-warning'>Please choose a site to continue </p>
                      }
                    </>
                  )}
                />
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Prompt <span className='text-danger'>*</span></Label>
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
                  <Label>Post Title <span className='text-danger'>*</span></Label>
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
                  <Label>Campaign Title <span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="campaign_title"
                  rules={{ required: "This field is mandatory" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      innerRef={field.ref}
                      autoFocus
                      type="text"
                      id="campaign_title"
                      placeholder='Campaign Title'                      
                      invalid={errors.campaign_title}
                    />
                  )}
                />
              {errors.title && (<p className="text-danger">{errors.title.message}</p>)}
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Post Content <span className='text-danger'>*</span></Label>
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
                  <Label>Post Interval <span className='text-danger'>*</span></Label>
                  <Controller
                  control={control}
                  name="interval"
                  rules={{ required: "Interval details is required" }}
                  defaultValue={intervalOptions[0]}
                  render={({ field }) => (
                    <>
                      <Select
                        theme={selectThemeColors}
                        {...field}
                        defaultValue={intervalOptions[0]}
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
            {files.length && uploadedImage === '' ? (
          <Fragment>
            <ListGroup className='my-2'>{fileList}</ListGroup>
            {/* <div className='d-flex justify-content-end'>
              <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                Remove All
              </Button>
            </div> */}
          </Fragment>
        ) : null}
        { uploadedImage !== '' && uploadedImage !== "https://dall-e-article-images.s3.amazonaws.com/None" && <Row className='mt-1'>
          <Col>
          <h6>Uploaded Image</h6>
          <img src={uploadedImage} alt="uploaded image" style={{width:'200px'}}></img>
          </Col></Row>
        }
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
