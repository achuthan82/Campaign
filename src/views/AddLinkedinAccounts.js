import React from "react"
import {
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Col,
  Label,
  Input,
  Form,
  Button,
  ModalFooter,
  Spinner
} from "reactstrap"
import { useForm, Controller } from "react-hook-form"

const AddLinkedinAccounts = ({ linkedinModal }) => {
  const form = useForm()
  const {
    control,
    handleSubmit,
    // setValue,
    formState: { errors }
  } = form
  const addAccount = (data) => {
     console.log('data', data)
  }
  return (
    <div>
      <Modal isOpen={linkedinModal} size="sm" toggle={close}>
        <ModalHeader toggle={close}> </ModalHeader>
        {/* <Form> */}
          <Form onSubmit={handleSubmit(addAccount)}>
          <ModalBody className="p-3">
            <div className="mb-1">
              <div className="mb-1 d-flex justify-content-center">
                <h2>Add Account</h2>
              </div>
            </div>
            <Row className='mb-1'>
                <Col>
                  <Label>Email<span className='text-danger'>*</span></Label>
                  <Controller
                  id='loginEmail'
                  name='loginEmail'
                  control={control}
                  rules={{ required: "Email is required",
                           pattern: {
                                      value: /.+\..+/,
                                      message: 'Invalid Email'
                                    }
                         }}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      innerRef={field.ref} 
                      type='email'
                      placeholder='Email address associated with your LinkedIn account'
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                     
                />
                {errors.loginEmail && <span className='text-danger'>{errors.loginEmail.message}</span>}

                  {/* <Input type='text' placeholder='Email'></Input> */}
                </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="d-flex justify-content-center">
            <Button color="primary" type='submit'>Submit</Button>
            <Button color="secondary">Cancel</Button>
            {/* <Button color='primary' type="submit" disabled={loading}>{loading && <Spinner size="sm" className='me-50' />} Submit</Button>
            <Button onClick={close}>Cancel</Button> */}
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

export default AddLinkedinAccounts
