import React, {useState, useEffect} from "react"
import AddCampaign from "./AddCampaign"
import DeleteCampaign from "./DeleteCampaign"
import { toast } from 'react-hot-toast'
import moment from "moment"

import DataTable from 'react-data-table-component'
import apiConfig from '../configs/apiConfig'
import axios from 'axios'
import { getToken } from '@utils'
import { Card, Badge, CardHeader, CardTitle, Input, Label, Button, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap"
import { ChevronDown, Plus,  MoreHorizontal, MoreVertical, ArrowRightCircle, Edit2, Grid, List, Trash, Eye, RefreshCw, Check, X, PauseCircle, PlayCircle } from "react-feather"
import ReactPaginate from "react-paginate"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from "react-router-dom"
import ComponentSpinner from '@components/spinner/Loading-spinner'

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
const DashboardTable = () => {
  const navigate = useNavigate()
  const token = getToken()
  const MySwal = withReactContent(Swal)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [campaignList, setCampaignList] = useState([])
  const [paginatedData, setPaginatedData] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [editData, setEditData] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteUrl, setDeleteUrl] = useState('')
  const [searchValue, setSearchValue] = useState('')
  // const [deleteId, setDeleteId] = useState('')
  const [pauseLoad, setPauseLoad] = useState(false)
  // setDeleteId(null)
  const getCampaign = (page, per_page, val) => {
    setLoading(true)
    const config = {
      method: 'post',
      url: `${apiConfig.api.url}list_campaign?page=${page}&per_page=${per_page}`,
      data:{time_zone:"asia/kolkata", post_title: val},
      headers: { 
        Authorization: `Token ${token}`
      }
    }
    axios(config).then((response) => {
      console.log('response', response)
      setLoading(false)
      if (response.data.status === 200) {
         setPaginatedData(response.data)
         setCampaignList(response.data.data)
      } else if (response.data.status === 204) {
        setPaginatedData(null)
         setCampaignList([])
      } else {
        toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  

      }
    }).catch((error) => {
      setLoading(false)
      toast.error(<ToastContent message={error.message} />, { duration:3000 })  
    })
  }
  const handlePagination = (page) => {
    setCurrentPage(page.selected)
    getCampaign(page.selected + 1, rowsPerPage,  searchValue)
  }
  // const openDeleteModal = (row) => {
  //   setDeleteModal(true)
  //   setDeleteUrl(row.site_url)
  //   setDeleteId(row.id)
  // }
  const handlePerPage = (event) => {
    setCurrentPage(0)
    setRowsPerPage(parseInt(event.target.value))
    setTimeout(() => {
      getCampaign(1, event.target.value, searchValue)
    }, 300)
  }
  const handleSearch = (event) => {
    setSearchValue(event.target.value)
    setCurrentPage(0)
    setTimeout(() => {
      getCampaign(1, rowsPerPage, event.target.value)
    }, 1000)
  }

  const moveTo = (item) => {
    navigate(`/campaign/${item.id}`)
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
  useEffect(() => {
    getCampaign(1, 10, '')
    // getCategory()
  }, [])
  useEffect(() => {
    console.log("entered")
    window.scrollTo(0, 0)
  }, [modalOpen])
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
              url: `${apiConfig.api.url}delete_posts`,
              data:{site_url:item.site_url, complete_delete:true, campaign_id:item.id },
              headers: { 
                Authorization: `Token ${token}`
              }
            }
  
                axios(config)
                .then(function (response) {
                    console.log(response.data.status)
                    if (response.data.status === 200) {
                      getCampaign(currentPage + 1, rowsPerPage, searchValue)
                        toast.success(
                          <ToastContent message={'Successfully Deleted'} />,
                          {duration:3000}             
                        )
                    } else if (response.data.status === 204) {
                      getCampaign(currentPage + 1, rowsPerPage, searchValue)
                      toast.error(
                        <ToastContent message={response.data.message} />,
                        {duration:3000}             
                      )
                    } else if (response.data.status === 401) {
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
  const handleStatus = (row, text) => {
    console.log('row-status', row)
    console.log('pause_status', row.pause_status)
    setPauseLoad(true)
    const config = {
      method: 'post',
      url: `${apiConfig.api.url}campaign_status`,
      data: {pause_status: !row.pause_status, campaign_title: row.campaign_title, category_id:row.category_id, category_name:row.category_name, id: row.id, post_content: row.post_content, post_interval: row.post_interval, post_title: row.post_title, prompt: row.prompt, questions:row.questions, site_url:row.site_url, stored_questions:row.stored_questions}
  }
  axios(config).then((response) => {
    setPauseLoad(false)
    if (response.data.status === 200) {
        if (text !== 'delete') {
        toast.success(<ToastContent message={response.data.message} />, { duration:3000 }) 
        getCampaign(currentPage + 1, rowsPerPage, searchValue)
        } else {
          handleConfirmCancel(row)
        }
    } else {
        toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
    }
}).catch(() => {
    setPauseLoad(false)
    toast.error(<ToastContent message='Network Error' />, { duration:3000 })  

})

}

 
  const columns = [
    {
        name: 'Title',
        selector: 'post_title',
        sortable: true
    },
    {
      name: 'Campaign Title',
      selector: 'campaign_title',
      sortable: true,
      minWidth:'160px'
  },
    {
        name: 'URL',
        selector: 'site_url',
        sortable: true,
        cell: row => {
          console.log('row', row)
          return (
              <span className="truncated-paragraph">
                <a href={row.site_url} target="_blank">{row.site_url}</a>
              </span>
          )
      }
    },
    {
      name: 'Posts',
      selector: 'post_count',
      maxWidth:'1px',
      sortable: true,
      cell: row => {
        console.log('row', row)
        return (
            <span>
              {row.post_count ? row.post_count : 0}
            </span>
        )
    }
    },
    {
        name: 'Created Date',
        selector: 'created_at',
        minWidth:'170px',
        sortable: true,
        cell: row => {
          console.log('row', row)
          return (
              <span>
                {moment(row.created_at, "ddd, DD MMM YYYY HH:mm:ss [GMT]").format('DD-MM-YYYY hh:mm A')}
              </span>
          )
      }
    },
    {
        name: 'Status',
        selector: 'status',
        sortable: true,
        maxWidth:'1px',
        cell: row => {
            console.log('row', row)
            return (
                <span>
                 <Badge color={row.status === 'Active' ? 'light-success' : 'light-warning'}>{row.status}</Badge>
                </span>
            )
        }
    },
    {
      name: 'Pause/Resume',
      selector: 'admin_status',
      // minWidth:'170px',
      cell: row => {
          return (
          <>
          {console.log(row)}
          <span title="Click here to Pause/Resume" onClick={() => handleStatus(row)} style={{cursor:'pointer'}}>{row.pause_status ? <PlayCircle className="pause-icon"/> : <PauseCircle className="pause-icon"/>}</span>
              {/* <div className='d-flex flex)-column'>
                  <div className='form-switch form-check-success'>
                  <Input type='switch' checked = {row.pause_status} onClick={() => handleStatus(row)} id={`switch_${row.id}`} name={`switch_${row.id}`} />
                  <CustomLabel htmlFor={`switch_${row.id}`} />
                  </div>
              </div> */}
          </>
          )
        }
     },
    {
        name: 'Action',
        allowOverflow: true,
        maxWidth:'1px',
        // minWidth: '100px',
        cell: (row, index) => {
         console.log(row)
          return (
            <div className='d-flex align-items-center'>
            <UncontrolledDropdown >
              <DropdownToggle className='pr-1' tag='span' style={{cursor:'pointer'}}>
                <MoreVertical size={15}  />
              </DropdownToggle>
            <DropdownMenu end className= {index === 0 && campaignList.length === 1 ? 'notification-dropdown' : ''}>
                        {/* <DropdownItem className='w-100' onClick={() => getEditDetails(row)}><Edit2 size={18} className='me-50' />Edit</DropdownItem> */}
                        {/* <DropdownItem className='w-100 d-flex align-items-end' onClick={() => openDeleteModal(row)}><Trash size={15} className='me-50'/><span style={{lineHeight:'0.8'}}>Delete Scheduled Posts</span></DropdownItem> */}
                        {
                          row.pause_status ? <DropdownItem className='w-100 d-flex align-items-end' onClick={() =>  handleConfirmCancel(row)}><Trash size={15} className='me-50'/><span style={{lineHeight:'0.8'}}>Delete Campaign</span></DropdownItem> : <DropdownItem className='w-100 d-flex align-items-end' onClick={() =>  handleStatus(row, 'delete')}><Trash size={15} className='me-50'/><span style={{lineHeight:'0.8'}}>Delete Campaign</span></DropdownItem> 

                        }
                        <DropdownItem className='w-100 d-flex align-items-end' onClick={() => moveTo(row)}><Eye size={15} className='me-50'/><span style={{lineHeight:'1.2'}}>View Single Page</span></DropdownItem>
            </DropdownMenu>
            </UncontrolledDropdown>

            </div>
          )
        }
      }
  

]
  return (
    <div>
      <Card>
      <div className='d-flex align-items-end p-2 border-bottom '>
          <h4 className="m-0 p-0" style={{lineHeight:'1'}}>Campaign List</h4><span title="Click here to Refresh" style={{cursor:'pointer'}} onClick={() => { getCampaign(currentPage + 1, rowsPerPage, searchValue) }}><RefreshCw size={16}  className="ms-50"/></span>
        </div>
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
            <Input type="text" placeholder="search by title" value={searchValue} onChange={(event) => handleSearch(event) }></Input>
            </div>
            <Button color="primary" className="me-1" onClick={() => { window.scrollTo(0, 0); setModalOpen(true); setEditData(null) }}><span className="me-50"><Plus size={15}></Plus></span>Add New</Button>
            </div>
            </div>
      <div className='dashbord-table react-dataTable p-1'>
          <DataTable
            pagination
            paginationServer
            noHeader
            className='react-dataTable'
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            data={campaignList}
            progressPending={loading}
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
      <AddCampaign modalOpen={modalOpen} setModalOpen={setModalOpen} editData={editData} getCampaign={getCampaign} setEditData={setEditData} searchValue={searchValue} setSearchValue={setSearchValue} setCurrentPage={setCurrentPage} rowsPerPage={rowsPerPage}/>
      <DeleteCampaign deleteModal={deleteModal} setDeleteModal={setDeleteModal} deleteUrl={deleteUrl} setDeleteUrl={setDeleteUrl} deleteId={null}></DeleteCampaign>
      {pauseLoad && <ComponentSpinner txt="Please Wait..."/>}
    </div>
  )
}

export default DashboardTable
