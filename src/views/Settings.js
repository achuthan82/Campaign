import React, {useState, useEffect} from 'react'
import { Copy, Delete, Edit, MoreVertical, ChevronDown, Plus, Trash, Linkedin, Check, X } from 'react-feather'
import { CardTitle, Card, CardBody, Badge, Label, Input, Row, Col, CardHeader, UncontrolledDropdown, DropdownItem, DropdownToggle, DropdownMenu, Button } from 'reactstrap'
import DataTable from 'react-data-table-component'
import KeyEditModal from './KeyEditModal'
import AddSite from './AddSite'
import apiConfig from '../configs/apiConfig'
import axios from 'axios'
import { getToken } from '@utils'
import { toast } from 'react-hot-toast'
import moment from "moment"
import ComponentSpinner from '@components/spinner/Loading-spinner'
import ReactPaginate from "react-paginate"
import { TRUE } from 'sass'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import AddLinkedinAccounts from './AddLinkedinAccounts'

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
const CustomLabel = ({ htmlFor }) => {
  return (
    <Label className='form-check-label' htmlFor={htmlFor}>
      <span className='switch-icon-left'>
        <Check size={14} />
      </span>
      <span className='switch-icon-right'>
        <X size={14} />
      </span>
    </Label>
  )
}
const Settings = () => {
    const token = getToken()
    const MySwal = withReactContent(Swal)
    const [keyModal, setKeyModal] = useState(false)
    const [siteModal, setSiteModal] = useState(false)
    const [siteData, setSiteData] = useState([])
    const [pending, setPending] = useState(false)
    const [aiDetails, setAiDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [editData, setEditData] = useState(null)
    const [searchValue, setSearchValue] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(0)
    const [paginatedData, setPaginatedData] = useState(null)
    const [linkedinRowsPerPage, setLinkedinRowsPerPage] = useState(10)
    const [linkedinCurrentPage, setLinkedInCurrentPage] = useState(0)
    const [linkedinPaginatedData, setLinkedinPaginatedData] = useState(null)
    const [linkedinModal, setLinkedinModal] = useState(false)
    const [linkedInData, setLinkedInData] = useState([])
    const [linkedinPending, setLinkedinPending] = useState(false)
    console.log('linkedin', linkedInData)
    const editOpen = (row) => {
       setEditData(row)
       setSiteModal(true)
    }
    // const data = [
    //     {
    //       name:'Test 1',
    //       url:'sfhsdjssdf',
    //       status:'Active'

    //     },
    //     {
    //         name:'Test 2',
    //         url:'sfhsdjssdf',
    //         status:'Active'
  
    //       }
    // ]
    const getSiteDetails = (page, per_page, value) => {
      setPending(true)
      const config = {
        method: 'post',
        url: `${apiConfig.api.url}site_search?page=${page}&per_page=${per_page}`,
        data:{search: value},
        headers: { 
          ContentType: "application/json",
          Authorization: `Token ${token}`
        }
      }
      axios(config).then((response) => {
        console.log('response', response)
        setPending(false)
        if (response.data.status === 200) {
           setPaginatedData(response.data)
           setSiteData(response.data.data)
        } else if (response.data.status === 204) {
          setPaginatedData(null)
          setSiteData([])
        } else {
          toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
        }
      }).catch((error) => {
        setPending(false)
        toast.error(<ToastContent message={error.message} />, { duration:3000 })  
      })
    }
    const getLinkedInList = (page, per_page) => {
      setLinkedinPending(true)
      const config = {
        method: 'get',
        url: `${apiConfig.api.url}linkedin/list?page=${page}&per_page=${per_page}&time_zone=asia/kolkata`,
        headers: { 
          Authorization: `Token ${token}`
        }
      }
      axios(config).then((response) => {
        console.log('response', response)
        setLinkedinPending(false)
        if (response.data.status === 200) {
          setLinkedinPaginatedData(response.data)
          setLinkedInData(response.data.data)
        } else if (response.data.status === 204) {
          setLinkedinPaginatedData(null)
          setLinkedInData([])
        } else {
          toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
        }
      }).catch((error) => {
        setLinkedinPending(false)
        toast.error(<ToastContent message={error.message} />, { duration:3000 })  
      })
    }
    const getOpenApi = () => {
      setLoading(true)
      const config = {
        method: 'get',
        url: `${apiConfig.api.url}openai_api_key`,
        headers: { 
          Authorization: `Token ${token}`
        }
      }
      axios(config).then((response) => {
        setLoading(false)
        console.log('response', response)
        if (response.data.status === 200) {
          setAiDetails(response.data.data.openai_api_key1)
        } else if (response.data.status === 204) {
          setAiDetails(null)
        } else {
          toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
        }
      }).catch((error) => {
        setLoading(false)
        toast.error(<ToastContent message={error.message} />, { duration:3000 })  
      })
    }
  
    const handleDelete = (id, text) => {
      return MySwal.fire({
        title: "Are you sure?",
        text: "You want to delete!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Confirm!",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-danger ms-1"
        },
        buttonsStyling: false
      }).then(function (result) {
        if (result.value) {
       
          const config = {
            method: "delete",
            url: text !== 'linkedin' ? `${apiConfig.api.url}site_settings/${id}` : `${apiConfig.api.url}linkedin/delete/${id}`,
            headers: {
              ContentType: "application/json",
              Authorization: `Token ${token}`
            }
          }
          console.log(config)
          axios(config)
            .then((response) => {
              console.log(response.data.status)
              if (response.data.status === 200) {
                if (text !== 'linkedin') {
                setCurrentPage(0)
                getSiteDetails(1, rowsPerPage, searchValue)
                } else {
                  setLinkedInCurrentPage(0)
                  getLinkedInList(1, linkedinRowsPerPage)
                }
                MySwal.fire({
                  icon: "success",
                  title: "Deleted!",
                  text: "Successfully Deleted.",
                  customClass: {
                    confirmButton: "btn btn-success"
                  }
                })
              } else if (
                response.data.status > 200 &&
                response.data.status < 299
              ) {
                toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
              } else if (response.data.status === 401) {
                toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  

                // history.push("/login")
              }  else {
                toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
              }
            })
            .catch((error) => {
              console.log(error)
              toast.error(<ToastContent message={error.message} />, { duration:3000 })  
            })
        } else if (result.dismiss === MySwal.DismissReason.cancel) {
          MySwal.fire({
            title: "Cancelled",
            text: "Update Cancelled",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-success"
            }
          })
        }
      })
    }

    const handleSearch = (event) => {
      setSearchValue(event.target.value)
      setCurrentPage(0)
      setTimeout(() => {
        getSiteDetails(1, rowsPerPage, event.target.value)
      }, 1000)
    }
    const handlePagination = (page) => {
      setCurrentPage(page.selected)
      getSiteDetails(page.selected + 1, rowsPerPage, searchValue)
    }
    const handleLinkedInPagination = (page) => {
      setLinkedInCurrentPage(page.selected)
      getLinkedInList(page.selected + 1, linkedinRowsPerPage)
    }
  
    const handlePerPage = (event) => {
      setCurrentPage(0)
      setRowsPerPage(parseInt(event.target.value))
      setTimeout(() => {
        getSiteDetails(1, event.target.value, searchValue)
      }, 300)
    }
    const handleLinkedInPerPage = (event) => {
      setLinkedInCurrentPage(0)
      setLinkedinRowsPerPage(parseInt(event.target.value))
      // setLinkedInRowsPerPage(parseInt(event.target.value))
      setTimeout(() => {
        getLinkedInList(1, event.target.value)
      }, 300)
    }

    const CustomPagination = () => (
      <ReactPaginate
        previousLabel=""
        nextLabel=""
        forcePage={currentPage}
        onPageChange={(page) => handlePagination(page)}
        pageCount={
          paginatedData &&
          (Math.ceil(paginatedData.pagination.total / rowsPerPage) || 1)
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
      />
    )
    const LinkedinCustomPagination = () => (
      <ReactPaginate
        previousLabel=""
        nextLabel=""
        forcePage={linkedinCurrentPage}
        onPageChange={(page) => handleLinkedInPagination(page)}
        pageCount={
          linkedinPaginatedData &&
          (Math.ceil(linkedinPaginatedData.pagination.total / rowsPerPage) || 1)
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
      />
    )
    const handleStatus = (row) => {
      const config = {
        method: 'put',
        url: `${apiConfig.api.url}linkedin/update-status/${row.id}`,
        data: {is_active: !row.is_active}
    }
    axios(config).then((response) => {
      if (response.data.status === 200) {
          toast.success(<ToastContent message={response.data.message} />, { duration:3000 })
          // setCurrentPage(0) 
          // getSiteDetails(currentPage + 1, rowsPerPage, searchValue)
          getLinkedInList(linkedinCurrentPage + 1, linkedinRowsPerPage)
      } else {
          toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
      }
  }).catch(() => {
      toast.error(<ToastContent message='Network Error' />, { duration:3000 })  

  })

  }
    const columns = [
      {
          name: 'Name',
          selector: 'site_name',
          sortable: true
      },
      {
          name: 'URL',
          selector: 'site_url',
          sortable: true,
          cell: row => {
            console.log('row', row)
            return (
                <span className='text-truncate'>
                  <a href={row.site_url} target="_blank">{row.site_url}</a>
                </span>
            )
        }
      },
      {
          name: 'Status',
          selector: 'status',
          sortable: true,
          cell: row => {
              console.log('row', row)
              return (
                  <span>
                   <Badge color={row.site_status === 'Active' ? 'light-success' : 'light-warning'}>{row.site_status}</Badge>
                  </span>
              )
          }
          // minWidth: '152px'
      },
      {
          name: 'Action',
          allowOverflow: true,
          minWidth: '100px',
          cell: (row) => {
           console.log(row)
            return (
              <div className='d-flex align-items-center'>
              <span className='me-1' style={{cursor:'pointer'}}  onClick={() => editOpen(row)}><Edit size={15}/></span>
               <span className='me-1' style={{cursor:'pointer'}} onClick={() => handleDelete(row.id)}><Trash size={15}/></span> 

              {/* <UncontrolledDropdown >
                <DropdownToggle className='pr-1' tag='span' style={{cursor:'pointer'}}>
                  <MoreVertical size={15}  />
                </DropdownToggle>
              </UncontrolledDropdown> */}
              </div>
            )
          }
        }

  ]
  const linkedInColumns = [
    {
        name: 'Name',
        selector: 'site_name',
        sortable: true,
        cell: row => {
          console.log('row', row)
          return (
              <span className='text-truncate'>
              {row.name}
              </span>
          )
      }
    },
    {
        name: 'email',
        selector: 'site_url',
        sortable: true,
        cell: row => {
          console.log('row', row)
          return (
              <span className='text-truncate'>
                {row.email}
              </span>
          )
      }
    },
    {
        name: 'Activate/Inactivate',
        selector: 'status',
        sortable: true,
        cell: row => {
          return (
      <div className='d-flex flex-column'>
          <div className='form-switch form-check-success'>
          <Input type='switch' checked = {row.is_active} onClick={() => handleStatus(row)} id={`switch_${row.id}`} name={`switch_${row.id}`} />
          <CustomLabel htmlFor={`switch_${row.id}`} />
          </div>
      </div>
          )
        }
        // minWidth: '152px'
    },
    {
        name: 'Action',
        allowOverflow: true,
        minWidth: '100px',
        cell: (row) => {
         console.log(row)
          return (
            <div className='d-flex align-items-center'>
            {/* <span className='me-1' style={{cursor:'pointer'}}><Edit size={15}/></span> */}
             <span className='me-1' style={{cursor:'pointer'}} onClick={() => handleDelete(row.id, 'linkedin')}><Trash size={15}/></span> 

            {/* <UncontrolledDropdown >
              <DropdownToggle className='pr-1' tag='span' style={{cursor:'pointer'}}>
                <MoreVertical size={15}  />
              </DropdownToggle>
            </UncontrolledDropdown> */}
            </div>
          )
        }
      }

]
    const addOpen = () => {
      setEditData(null)
      setSiteModal(true)
    }
    const handleCopy = (data) => {
      navigator.clipboard.writeText(data)
      toast.success(<ToastContent message='Text copied to clipboard'/>, { duration:3000 })  
    }
    useEffect(() => {
      getSiteDetails(1, 10, '')
      getLinkedInList(1, 10)
      getOpenApi()
    }, [])
  return (
    <div>
      <h2 className='card-text-log mb-1'>Open AI and Site Settings</h2>
      <Card className='mb-1'>
        <CardBody>
           <div className='mb-1'>
           <h4 className='mb-1'>Open AI API Key List</h4>
           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
           </div>
            <div>
                <Card className='nested-card p-1 mb-0'>
                    <CardBody>
                    { aiDetails !== null ? <div>
                  <div className='d-flex justify-content-between align-items-center mb-1'>
                  <div className='d-flex vertical-align-middle'>
                  <h3 className='me-1'>{ aiDetails.name }</h3>
                  <span><Badge color='light-primary'>{aiDetails.selected_status ? 'Active' : 'Inactive'}</Badge></span>
                  </div>
                  <span style={{cursor:'pointer'}} onClick={() => setKeyModal(true)}><MoreVertical size={15}></MoreVertical></span>
                  </div>
                  <div className='mb-1'>
                    <span className='me-1'>{aiDetails.openai_api_key}</span>
                    <span style={{cursor:'pointer'}} onClick={() => handleCopy(aiDetails.openai_api_key)}><Copy size={15}/></span>
                  </div>
                  <div>
                    <small>{aiDetails.created_at === aiDetails.updated_at ? 'Added on' : 'Updated on'} {aiDetails.created_at === aiDetails.updated_at ? moment(aiDetails.created_at, "ddd, DD MMM YYYY HH:mm:ss [GMT]").format('DD-MM-YYYY hh:mm A') : moment(aiDetails.updated_at, "ddd, DD MMM YYYY HH:mm:ss [GMT]").format('DD-MM-YYYY hh:mm A')  }</small>
                  </div>
                  </div> : <div><div className='d-flex justify-content-end'><span style={{cursor:'pointer'}} onClick={() => setKeyModal(true)}><Plus size={15}></Plus></span></div><div className='text-center'>No AI Key to show</div></div>
                 }
                  </CardBody>
                </Card>
            </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Site List</CardTitle>
        </CardHeader>
            <div className='d-flex justify-content-between flex-wrap vertical-align-middle px-2 mt-50 mb-1'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select' className='me-50'>show</Label>
              <Input
                // className='dataTable-select'
                type='select'
                id='sort-select'
                onChange={e => handlePerPage(e)}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
            </div>
            <div className='d-flex align-items-end justify-content-sm-end mt-sm-0 mt-1'>
            <div className='me-1'>
            <Input type="text" placeholder="Search by Name" value={searchValue} onChange={(event) => handleSearch(event) }></Input>
            </div>
            <Button color="primary" onClick={addOpen}><span className='me-50'><Plus size={15}/></span><span>Add New </span></Button>
            </div>
            </div>
        <div className='react-dataTable p-1'>
          <DataTable
            pagination
            paginationServer
            noHeader
            className='react-dataTable'
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            data={siteData}
            progressPending={pending}
            paginationComponent={
              paginatedData &&
              paginatedData.hasOwnProperty("pagination") &&
              CustomPagination
            }
            paginationPerPage={rowsPerPage}
            paginationDefaultPage={currentPage + 1}
          />
        </div>
      </Card>
      <Card>
        <CardHeader className='border-bottom'>
          <div className='d-flex align-items-end'>
          <h4 className='d-inline me-50' style={{lineHeight:'2px'}}>LinkedIn Accounts</h4>
          <span><Linkedin size={20} style={{stroke: '#462E95'}}/></span>
          </div>
        </CardHeader>
            <div className='d-flex justify-content-between flex-wrap vertical-align-middle px-2 mt-50 mb-1'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select' className='me-50'>show</Label>
              <Input
                // className='dataTable-select'
                type='select'
                id='sort-select'
                onChange={e => handleLinkedInPerPage(e)}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
            </div>
            <div className='d-flex align-items-end justify-content-sm-end mt-sm-0 mt-1'>
            {/* <div className='me-1'>
            <Input type="text" placeholder="Search by Name" value={searchValue} onChange={(event) => handleSearch(event) }></Input>
            </div> */}
            <Button color="primary" onClick={() => setLinkedinModal(true)}><span className='me-50'><Plus size={15}/></span><span>Add New Account</span></Button>
            </div>
            </div>
        <div className='react-dataTable p-1'>
          <DataTable
            pagination
            paginationServer
            noHeader
            className='react-dataTable'
            columns={linkedInColumns}
            sortIcon={<ChevronDown size={10} />}
            data={linkedInData}
            progressPending={linkedinPending}
            paginationComponent={
              linkedinPaginatedData &&
              linkedinPaginatedData.hasOwnProperty("pagination") &&
              LinkedinCustomPagination
            }
            paginationPerPage={linkedinRowsPerPage}
            paginationDefaultPage={linkedinCurrentPage + 1}
          />
        </div>
      </Card>
      {loading && <ComponentSpinner txt="Loading.."/>}
    <AddLinkedinAccounts linkedinModal={linkedinModal} setLinkedinModal={setLinkedinModal}/>
    <KeyEditModal keyModal={keyModal} setKeyModal={setKeyModal} aiDetails={aiDetails} getOpenApi={getOpenApi}/>
    <AddSite siteModal={siteModal} setSiteModal={setSiteModal} getSiteDetails={getSiteDetails} editData={editData} setEditData={setEditData} searchValue={searchValue} setSearchValue={setSearchValue} setCurrentPage={setCurrentPage} rowsPerPage={rowsPerPage}/>
    </div>
  )
}

export default Settings
