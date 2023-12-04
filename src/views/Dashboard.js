import React, {useState} from "react"
import { MoreHorizontal, MoreVertical, ArrowRightCircle, Plus } from "react-feather"
import { Row, Col, Input, Button, Card, CardBody, Badge } from "reactstrap"
import AddCampaign from "./AddCampaign"

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false)
  
  return (
    <div>
      <Row className="mb-1">
        <Col md={6}>
          <h3>Campaigns</h3>
        </Col>
        <Col className="d-flex justify-content-end ">
          
            <span className="me-1">
             <Input type="text" placeholder="search"></Input>
             </span>
           
              <Button color="primary" onClick={() => setModalOpen(true)}><span className="me-50"><Plus size={15}></Plus></span>Add New</Button>
           
        </Col>
      </Row>
      <Row>
        <Col md={6} lg={4}>
          <Card className="campaign-card">
            <CardBody>
              <Row className="align-items-center mb-1">
                <Col xs={10}>
                  <h5>Campaign 1</h5>
                  <p>24-11-2023 11:00 AM</p>
                </Col>
                <Col className="d-flex justify-content-end" xs={2}>
                  <span>
                    <MoreVertical size={15}></MoreVertical>
                  </span>
                </Col>
              </Row>
              <Row className="mb-1">
                <Col>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </Col>
              </Row>
              <Row className="align-items-middle">
                <Col>
                  <span>
                    {" "}
                    <Badge color="light-warning" className="p-50">
                      RUNNING
                    </Badge>
                  </span>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button color="primary" size="sm">
                    <span>
                      <ArrowRightCircle size={20} />
                    </span>
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="campaign-card" style={{backgroundColor:'rgba(70, 46, 149, 0.03)'}}>
            <CardBody>
              <Row className="align-items-center mb-1">
                <Col xs={10}>
                  <h5>Campaign 1</h5>
                  <p>24-11-2023 11:00 AM</p>
                </Col>
                <Col className="d-flex justify-content-end" xs={2}>
                  <span>
                    <MoreVertical size={15}></MoreVertical>
                  </span>
                </Col>
              </Row>
              <Row className="mb-1">
                <Col>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </Col>
              </Row>
              <Row className="align-items-middle">
                <Col>
                  <span>
                    {" "}
                    <Badge color="light-success" className="p-50">
                      SUCCESS
                    </Badge>
                  </span>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button color="primary" size="sm">
                    <span>
                      <ArrowRightCircle size={20} />
                    </span>
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="campaign-card">
            <CardBody>
              <Row className="align-items-center mb-1">
                <Col xs={10}>
                  <h5>Campaign 1</h5>
                  <p>24-11-2023 11:00 AM</p>
                </Col>
                <Col className="d-flex justify-content-end" xs={2}>
                  <span>
                    <MoreVertical size={15}></MoreVertical>
                  </span>
                </Col>
              </Row>
              <Row className="mb-1">
                <Col>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </Col>
              </Row>
              <Row className="align-items-middle">
                <Col>
                  <span>
                    {" "}
                    <Badge color="light-warning" className="p-50">
                      RUNNING
                    </Badge>
                  </span>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button color="primary" size="sm">
                    <span>
                      <ArrowRightCircle size={20} />
                    </span>
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <AddCampaign modalOpen={modalOpen} setModalOpen={setModalOpen}/>
    </div>
  )
}

export default Dashboard
