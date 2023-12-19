import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { MoreHorizontal, MoreVertical, ArrowRightCircle, Plus, Edit2, Grid, List } from "react-feather"
import { Row, Col, Input, Button, Card, CardBody, Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, ButtonGroup } from "reactstrap"
import AddCampaign from "./AddCampaign"
import apiConfig from '@configs/apiConfig'
import axios from "axios"
import { getToken } from '@utils'
import { toast } from 'react-hot-toast'
import ComponentSpinner from '@components/spinner/Loading-spinner'
import moment from "moment"
import classnames from "classnames"

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

const Dashboard = () => {
  const token = getToken()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [campaignList, setCampaignList] = useState([])
  const [editData, setEditData] = useState(null)
  const [view, setView] = useState("list")
  const getCampaign = () => {
    setLoading(true)
    const config = {
      method: 'get',
      url: `${apiConfig.api.url}list_campaign?time_zone=asia/kolkata`,
      headers: { 
        Authorization: `Token ${token}`
      }
    }
    axios(config).then((response) => {
      console.log('response', response)
      setLoading(false)
      if (response.data.status === 200) {
         setCampaignList(response.data.data)
      } else if (response.data.status === 204) {
         setCampaignList([])
      } else {
        toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  

      }
    }).catch((error) => {
      setLoading(false)
      toast.error(<ToastContent message={error.message} />, { duration:3000 })  
    })
  }
  const getEditDetails = (item) => {
     setEditData(item)
     setModalOpen(true)
  }
  
  useEffect(() => {
    getCampaign()
    // getCategory()
  }, [])
  const moveTo = (item) => {
    navigate(`/dashboard/${item.id}`)
  }
  const campaignColor = { backgroundColor:'rgba(70, 46, 149, 0.03)' }
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
           
              <Button color="primary" className="me-1" onClick={() => { setModalOpen(true); setEditData(null) }}><span className="me-50"><Plus size={15}></Plus></span>Add New</Button>
              <ButtonGroup>
              <Button
              tag="label"
              className={classnames("btn-icon view-btn list-view-btn", {
                active: view === "list"
              })}
              color="primary"
              outline
              onClick={() => setView("list")}
            >
              <List size={18} />
            </Button>
            <Button
              tag="label"
              className={classnames("btn-icon view-btn grid-view-btn", {
                active: view === "grid"
              })}
              color="primary"
              outline
              onClick={() => setView("grid")}
            >
              <Grid size={18} />
            </Button>
           
          </ButtonGroup>
           
        </Col>
      </Row>
      <Row>
        {
          campaignList && campaignList.length > 0 && 
          campaignList.map((item, index) => {
            return (
              <Col md={6} lg={view === 'list' ? 12 : 4} key={item.id}>
            <Card className="campaign-card" style={ index % 2 !== 0 ? campaignColor : null}>
              <CardBody>
                <Row className={`align-items-top ${view !== 'list' ? 'mb-1' : ''}`}>
                  <Col xs={10}>
                    <h5>{item.post_title}</h5>
                    <p>{moment(item.created_at, "ddd, DD MMM YYYY HH:mm:ss [GMT]").format('DD-MM-YYYY hh:mm A')}</p>
                  </Col>
                  <Col className="d-flex justify-content-end" xs={2}>
                    <UncontrolledDropdown>
                    <DropdownToggle className='pr-1' tag='span' style={{cursor:'pointer'}}>
                      <MoreVertical size={15}  />
                    </DropdownToggle>
                    <DropdownMenu end>
                        <DropdownItem className='w-100' onClick={() => getEditDetails(item)}><Edit2 size={18} className='me-50' />Edit</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  </Col>
                </Row>
                <Row className={`${view !== 'list' ? 'mb-1' : ''}`}>
                  <Col>
                    <p className="truncated-paragraph">
                     {item.post_content}
                    </p>
                  </Col>
                </Row>
                <Row className="align-items-middle">
                  <Col>
                    <span>
                      {" "}
                      <Badge color={item.status === 'Active' ? 'light-success' : 'light-warning'} className="p-50">
                        {item.status}
                      </Badge>
                    </span>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Button color="primary" size="sm" onClick={() => moveTo(item)}>
                      <span>
                        <ArrowRightCircle size={20} />
                      </span>
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
            )
          })
         
        }
        
        {/* <Col md={6} lg={4}>
          <Card className="campaign-card" style={{backgroundColor:'rgba(70, 46, 149, 0.03)'}}>
            <CardBody>
              <Row className="align-items-top mb-1">
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
        </Col> */}
        {/* <Col md={6} lg={4}>
          <Card className="campaign-card">
            <CardBody>
              <Row className="align-items-top mb-1">
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
        </Col> */}
      </Row>
      <AddCampaign modalOpen={modalOpen} setModalOpen={setModalOpen} editData={editData} getCampaign={getCampaign} setEditData={setEditData}/>
      {loading && <ComponentSpinner txt="Loading.."/>}
    </div>
  )
}

export default Dashboard
