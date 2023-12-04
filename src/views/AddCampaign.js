import React, {useState, Fragment} from 'react'
import Select from 'react-select'
import { Modal, ModalBody, ModalHeader, Row, Col, Label, Input, ListGroup, ListGroupItem, Button, ModalFooter } from 'reactstrap'
import { selectThemeColors } from '@utils'

import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

const AddCampaign = ({modalOpen, setModalOpen}) => {
    console.log(modalOpen)
    const [files, setFiles] = useState([])
    const [selected, setSelected] = useState([])
    const [categoryModal, setCategoryModal] = useState(false)

    const categoryOptions = [{label:'Category 1', value:'Category 1'}, {label:'Category 2', value:'Category 2'}]
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: acceptedFiles => {
        setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
      }
    })
  
    const renderFilePreview = file => {
      if (file.type.startsWith('image')) {
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
            <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
          </div>
        </div>
        <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
          <X size={14} />
        </Button>
      </ListGroupItem>
    ))
  
    const handleRemoveAllFiles = () => {
      setFiles([])
    }
  return (
    <div>
      <Modal isOpen={modalOpen} size="lg" toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}> </ModalHeader>
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
                  <Select></Select>
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Add Questions</Label>
                  <Input type='textarea' placeholder='Question one per line'></Input>
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  {/* <Label className=' d-flex justify-content-between'><sapn>Categories</sapn><span className='card-text-log'>Create Category if not existing</span></Label> */}
                  <div className='d-flex justify-content-between'>
                   <Label>Categories</Label>
                   <h6 className='card-text-log' onClick={() => setCategoryModal(true)} style={{cursor:'pointer'}}>Create Categories if not existing</h6>
                  </div>
                  <Select theme={selectThemeColors} isMulti options={categoryOptions}/>
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Prompt</Label>
                  <Input type='textarea' placeholder='Add prompt here..'></Input>
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Post Title</Label>
                  <Input type='text' placeholder='Post Title'></Input>
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Post Content</Label>
                  <Input type='textarea' placeholder='Add Post Content here..'></Input>
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Post Interval</Label>
                  <Select></Select>
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
            <div className='d-flex justify-content-end'>
              <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                Remove All
              </Button>
            </div>
          </Fragment>
        ) : null}
        </ModalBody>
        <ModalFooter className='d-flex justify-content-center'>
            <Button color='primary' onClick={() => setModalOpen(false)}>Submit</Button>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>

        </ModalFooter>
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
            <Button color='primary' onClick={() => setCategoryModal(false)}>Submit</Button>
            <Button onClick={() => setCategoryModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AddCampaign
