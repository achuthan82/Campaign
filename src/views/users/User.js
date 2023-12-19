import React, {useState, useEffect} from 'react'
import { Plus, Edit, Trash, ChevronDown } from 'react-feather'
import { Button, Card, CardHeader, Label, Input, Badge, CardTitle } from 'reactstrap'
import AddUser from './AddUser'
import apiConfig from '../../configs/apiConfig'
import axios from 'axios'
import { getToken } from '@utils'
import DataTable from 'react-data-table-component'
import Avatar from "@components/avatar"
import { toast } from 'react-hot-toast'
import ReactPaginate from "react-paginate"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

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
const User = () => {
    const token = getToken()
    const MySwal = withReactContent(Swal)
    const [modalOpen, setModalOpen] = useState(false)
    const [userList, setUserList] = useState([])
    const [pending, setPending] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(0)
    const [paginatedData, setPaginatedData] = useState(null)
    const [editData, setEditData] = useState(null)
    const editOpen = (row) => {
      setEditData(row)
      setModalOpen(true)
    }
 
    const getUsers = (page, per_page) => {
      setPending(true)
      const config = {
        method: 'get',
        url: `${apiConfig.api.url}user/paginated_list?page=${page}&per_page=${per_page}&time_zone='asia/kolkata'`,
        headers: { 
          Authorization: `Token ${token}`
        }
      }
      axios(config).then((response) => {
        console.log(response.data)
        setPending(false)
        if (response.data.status === 200) {
          setUserList(response.data.data)
          setPaginatedData(response.data)

        } else {
          setUserList([])
          toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  

        }
      }).catch((error) => {
        setPending(false)
        toast.error(<ToastContent message={error.message} />, { duration:3000 })  

      })
    }
    const handleDelete = (id) => {
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
            url: `${apiConfig.api.url}user/${id}`,
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
                setCurrentPage(0)
                getUsers(1, rowsPerPage)
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
              toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
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
    const columns = [
      {
          name: 'Name',
          selector:'first_name',
          sortable: true,
          cell: (row, index) => {
            const name = row.first_name.concat(' ').concat(row.last_name)
            return (
                <span>
                  <span className="me-1">
              <Avatar
                color={index % 2 === 0 ? "light-secondary" : "light-primary"}
                content={name}
                initials
              />
            </span>
                <span>
                  {name}
                </span>
                </span>
            )
        }
      },
      {
          name: 'Email',
          selector: 'email',
          sortable: true
      },
      {
          name: 'Status',
          selector: 'status',
          sortable: true,
          cell: row => {
              console.log('row', row)
              return (
                  <span>
                   <Badge color={row.is_active  ? 'light-success' : 'light-warning'}>{row.is_active ? 'Active' : 'Inactive'}</Badge>
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
              <span className='me-1' style={{cursor:'pointer'}} onClick={() => editOpen(row)}><Edit size={15}/></span>
              <span className='me-1' style={{cursor:'pointer'}} onClick={() => handleDelete(row.id)}><Trash size={15}/></span>
              </div>
            )
          }
        }

  ]
    const handlePagination = (page) => {
      setCurrentPage(page.selected)
      getUsers(page.selected + 1, rowsPerPage)
    }
  
    const handlePerPage = (event) => {
      setCurrentPage(0)
      setRowsPerPage(parseInt(event.target.value))
      setTimeout(() => {
        getUsers(1, event.target.value)
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

   const addOpen = () => {
    setEditData(null)
    setModalOpen(true)
   }
    useEffect(() => {
      getUsers(1, 10)
    }, [])
  return (
    <div>
        <div className='d-flex justify-content-between'>
           {/* <h3>Users</h3> */}
        </div>
        <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Users</CardTitle>
        </CardHeader>
            <div className='d-flex justify-content-between flex-wrap vertical-align-middle px-2 mt-50 mb-1'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select' className='me-50'>show</Label>
              <Input
                className='dataTable-select'
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
          
            <Input
              className='dataTable-filter'
              type='text'
              placeholder='Search'
              id='search-input'
            />
            </div>
            <Button color='primary' onClick={addOpen}><span className='me-50'><Plus size={15}/></span> Add User</Button>
            </div>
            </div>
         
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            paginationServer
            className='react-dataTable'
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            data={userList}
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
      <AddUser modalOpen={modalOpen} setModalOpen={setModalOpen}   setCurrentPage={setCurrentPage} rowsPerPage={rowsPerPage} getUsers={getUsers} editData={editData} setEditData={setEditData}></AddUser>
    </div>
  )
}

export default User
