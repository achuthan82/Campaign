import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Button, Card, CardBody, Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, ButtonGroup } from "reactstrap"
import { MoreHorizontal, MoreVertical, ArrowRightCircle, Plus, Edit2, Grid, List, Trash } from "react-feather"
import apiConfig from '@configs/apiConfig'
import axios from "axios"
import { getToken, getUserData } from '@utils'
import { toast } from 'react-hot-toast'
import TokenModal from './TokenModal'
import ComponentSpinner from '@components/spinner/Loading-spinner'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

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
const Token = () => {
  const user = getUserData()
  const MySwal = withReactContent(Swal)
  const [tokenList, setTokenList] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editData, setEditData] = useState(null)
  const token = getToken()
  const getTokenData = () => {
    setLoading(true)
    const config = {
      method:'post',
      url: `${apiConfig.api.url}list_token `,
      data: {created_by:user.dt.id},
      headers: { 
        Authorization: `Token ${token}`
      }
    }
    axios(config).then((response) => {
        setLoading(false)
        if (response.data.status === 200) {
            console.log(response.data.data)
            setTokenList(response.data.data)
        } else if (response.data.status === 204) {
          setTokenList([])
        } else {
          toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
        }
    }).catch((error) => {
      setLoading(false)
      toast.error(<ToastContent message={error.message} />, { duration:3000 })  
    })
  }
  const getEditData = (item) => {
      console.log('tem')
      setEditData(item)
      setModalOpen(true)
  }
  useEffect(() => {
    getTokenData()
  }, [])
  const handleConfirmCancel = (item) => {
    return MySwal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        },
        buttonsStyling: false
      }).then(function (result) {
        if (result.value) {
          const config = {
              method: 'delete',
              url: `${apiConfig.api.url}delete_token/${item.id}`,
              headers: { 
                Authorization: `Token ${token}`
              }
            }
  
                axios(config)
                .then(function (response) {
                    console.log(response.data.status)
                    if (response.data.status === 200) {
                       getTokenData()
                        toast.success(
                          <ToastContent message={'Successfully Deleted'} />,
                          {duration:3000}             
                        )
                    }  else if (response.data.status === 401) {
                      toast.error(
                        <ToastContent message={response.data.message} />,
                        {duration:3000}             
                      )
                    } else {
                      toast.error(
                        <ToastContent message={response.data.message} />,
                        {duration:3000}             
                      )
                    }
                })
                .catch(error => {
                  console.log(error)
                  if (error && error.status === 401) {
                    toast.error(
                      <ToastContent message={error.message} />,
                      { duration:2000 }
                    )
                  } else if (error) {
                    toast.error(
                      <ToastContent message={error.message} />,
                      { duration:2000 }
                    )
                  } 
                })
        } else if (result.dismiss === MySwal.DismissReason.cancel) {
            MySwal.fire({
              title: 'Cancelled',
              text: 'Card Delete Cancelled',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
          }
        })
}
  return (
    <div>
    <Row className="mb-1">
      <Col md={6}>
        <h3>Tokens</h3>
      </Col>
      <Col className="d-flex justify-content-end ">
        
          <span className="me-1">
           {/* <Input type="text" placeholder="search by name" value={searchValue} onChange={(event) => handleSearch(event) }></Input> */}
           </span>
            <Button color="primary" className="me-1" onClick={() => setModalOpen(true)}><span className="me-50"><Plus size={15}></Plus></span>Add New</Button> 
      </Col>
    </Row>
    <Row>
      {
        tokenList && tokenList.length > 0 && tokenList.map((item) => {
          return (
          <Col md={6} lg={4} key={item.id}>
          <Card className="campaign-card">
            <CardBody>
              <Row className={`align-items-top`}>
                <Col xs={10}>
                  <h5>{item.token_name}</h5>
                  <p>{item.token_code}</p>
                </Col>
                <Col className="d-flex justify-content-end" xs={2}>
                  <UncontrolledDropdown>
                  <DropdownToggle className='pr-1' tag='span' style={{cursor:'pointer'}}>
                    <MoreVertical size={15}  />
                  </DropdownToggle>
                  <DropdownMenu end>
                      <DropdownItem className='w-100' onClick={() => getEditData(item)} ><Edit2 size={18} className='me-50' /><span style={{lineHeight:'0.8'}}>Edit</span></DropdownItem>
                      <DropdownItem className='w-100' onClick={() => handleConfirmCancel(item)}><Trash size={18} className='me-50'/><span style={{lineHeight:'0.8'}}>Delete</span></DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="truncated-paragraph">
                   {item.token_data}
                  </p>
                </Col>
              </Row>
              <Row className="align-items-middle">
                
                <Col className="d-flex justify-content-end">
                  {/* <Button color="primary" size="sm">
                    <span>
                      <ArrowRightCircle size={20} />
                    </span>
                  </Button> */}
                </Col>
              </Row>
            </CardBody>
          </Card>
         </Col>
          )
        })
      }
    </Row>
    <div className="mt-1 d-flex justify-content-center">
    {/* <ReactPaginate
      previousLabel=""
      nextLabel=""
      forcePage={currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={
        paginatedData &&
        (Math.ceil(paginatedData.pagination.total / 3) || 1)
      }
      breakLabel="..."
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      nextLinkClassName="page-link"
      pageLinkClassName="page-link"
      breakLinkClassName="page-link"
      previousLinkClassName="page-link"
      nextClassName="page-item next-item"
      previousClassName="page-item prev-item"
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
    /> */}

    </div>
    <TokenModal modalOpen={modalOpen} setModalOpen={setModalOpen} getTokenData={getTokenData} editData={editData} setEditData={setEditData}/>
    {/* <AddCampaign modalOpen={modalOpen} setModalOpen={setModalOpen} editData={editData} getCampaign={getCampaign} setEditData={setEditData} searchValue={searchValue} setSearchValue={setSearchValue} setCurrentPage={setCurrentPage}/>
    <DeleteCampaign deleteModal={deleteModal} setDeleteModal={setDeleteModal} deleteUrl={deleteUrl} setDeleteUrl={setDeleteUrl}></DeleteCampaign>
    // loading && <ComponentSpinner txt="Loading.."/>} */}
    {loading && <ComponentSpinner txt="Loading.."/>}

  </div>
  )
}

export default Token
