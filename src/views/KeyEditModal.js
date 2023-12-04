import React from 'react'
import { Modal, ModalBody, ModalHeader, Row, Col, Label, Input, ListGroup, ListGroupItem, Button, ModalFooter } from 'reactstrap'
import Select from 'react-select'

const KeyEditModal = ({keyModal, setKeyModal}) => {
  return (
    <div>
       <Modal isOpen={keyModal} size="lg" toggle={() => setKeyModal(!keyModal)}>
        <ModalHeader toggle={() => setKeyModal(!keyModal)}> </ModalHeader>
        <ModalBody className='p-3'>
            <div className='mb-1'>
            <div className='mb-1 d-flex justify-content-center'>
                <h2>Add/Edit Open AI Key</h2>
            </div>
            </div>
            <Row className='mb-1'>
                <Col>
                  <Label>Name</Label>
                  <Input type='text' placeholder='Name'></Input>
                </Col>
            </Row>
            <Row className='mb-1'>
                <Col>
                  <Label>Open AI Key</Label>
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
            <Button color='primary' onClick={() => setKeyModal(!keyModal)}>Submit</Button>
            <Button onClick={() => setKeyModal(!keyModal)}>Cancel</Button>

        </ModalFooter>
      </Modal>
    </div>
  )
}

export default KeyEditModal
