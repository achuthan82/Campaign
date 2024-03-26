import React from "react"
import { Check, X } from "react-feather"
// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardBody, CardText } from 'reactstrap'
import { Link, useLocation } from "react-router-dom"
const AuthSuccess = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const authResult = searchParams.get("authenticated")
  return (
    <div className="d-flex justify-content-center align-items-center auth-wrap">
      <Card className="card-success p-5">
        <CardBody className="text-center">
          
          <Avatar
            icon={authResult === 'true' ? <Check size={28}/> : <X size={28}/>}
            className="shadow"
            color="primary"
            size="xl"
          />
          <div className="text-center">
            <h1 className="mb-1 text-white">{authResult === 'true' ? 'Success!' : 'Error'}</h1>
            {
              authResult === 'true' ?   <CardText className="m-auto w-100">
              You have completed the authentication successfuly.Click <Link to='/settings'>here</Link> to continue
            </CardText> : <CardText>Authentication Failed.Please try again later.Click <Link to='/settings'>here</Link> to go back </CardText>
            }
          
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default AuthSuccess
