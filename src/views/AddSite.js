import React from 'react'
import { Modal, ModalBody, ModalHeader, Row, Col, Label, Input, ListGroup, ListGroupItem, Button, ModalFooter } from 'reactstrap'
import Select from 'react-select'

const AddSite = ({siteModal, setSiteModal}) => {
  return (
    <div>
       <Modal isOpen={siteModal} size="lg" toggle={() => setSiteModal(!siteModal)}>
        <ModalHeader toggle={() => setSiteModal(!siteModal)}> </ModalHeader>
        <ModalBody className='p-3'>
            <div className='mb-1'>
            <div className='mb-1 d-flex justify-content-center'>
                <h2>Add New Site</h2>
            </div>
            </div>
            <Row className='mb-1'>
                <Col>
                  <Label> Site name</Label>
                  <Input type='text' placeholder='Site name'></Input>
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label> Site Url</Label>
                  <Input type='text' placeholder='Site Url'></Input>
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Site api Key</Label>
                  <Input type='textarea' placeholder='412qw34-1w2we34-345we24-qwe78qwe'></Input>
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Select Status</Label>
                  <Select></Select>
                </Col>
            </Row>
         
         
        </ModalBody>
        <ModalFooter className='d-flex justify-content-center'>
            <Button color='primary' onClick={() => setSiteModal(!siteModal)}>Submit</Button>
            <Button onClick={() => setSiteModal(!siteModal)}>Cancel</Button>

        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AddSite
