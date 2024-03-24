import React from "react"
import { Check } from "react-feather"
// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardBody, CardText } from 'reactstrap'
import { Link } from "react-router-dom"

const AuthSuccess = () => {
  return (
    <div className="d-flex justify-content-center align-items-center auth-wrap">
      <Card className="card-success p-5">
        <CardBody className="text-center">
          
          <Avatar
            icon={<Check size={28} />}
            className="shadow"
            color="primary"
            size="xl"
          />
          <div className="text-center">
            <h1 className="mb-1 text-white">Success!</h1>
            <CardText className="m-auto w-100">
              You have completed the authentication successfuly.Click <Link to='/settings'>here</Link> to continue
            </CardText>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default AuthSuccess
