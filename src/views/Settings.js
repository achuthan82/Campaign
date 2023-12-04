import React, {useState} from 'react'
import { Copy, Delete, Edit, MoreVertical, ChevronDown, Plus, Trash } from 'react-feather'
import { CardTitle, Card, CardBody, Badge, Label, Input, Row, Col, CardHeader, UncontrolledDropdown, DropdownItem, DropdownToggle, DropdownMenu, Button } from 'reactstrap'
import DataTable from 'react-data-table-component'
import KeyEditModal from './KeyEditModal'
import AddSite from './AddSite'
const Settings = () => {
    const [keyModal, setKeyModal] = useState(false)
    const [siteModal, setSiteModal] = useState(false)
    const columns = [
        {
            name: 'Name',
            selector: 'name',
            sortable: true
        },
        {
            name: 'URL',
            selector: 'url',
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
                     <Badge color='light-success'>Active</Badge>
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
                <span className='me-1' onClick={() => setKeyModal(!keyModal)}><Edit size={15}/></span>
                <span className='me-1'><Trash size={15}/></span>

                <UncontrolledDropdown >
                  <DropdownToggle className='pr-1' tag='span' style={{cursor:'pointer'}}>
                    <MoreVertical size={15}  />
                  </DropdownToggle>
                  {/* <DropdownMenu className= {index === 0 ? 'notification-dropdown' : ''} >
                      <DropdownItem className='w-100'><Edit size={18} className='me-50' />Edit</DropdownItem>
                      <DropdownItem className='w-100'><Delete size={18} className='me-50'/>Delete</DropdownItem>
                  </DropdownMenu> */}
                </UncontrolledDropdown>
                </div>
              )
            }
          }

    ]
    const data = [
        {
          name:'Test 1',
          url:'sfhsdjssdf',
          status:'Active'

        },
        {
            name:'Test 2',
            url:'sfhsdjssdf',
            status:'Active'
  
          }
    ]
  return (
    <div>
      <h2 className='card-text-log mb-1'>Open AI and Site Settings</h2>
      <Card className='p-1 mb-1'>
        <CardBody>
           <div className='mb-1'>
           <h4 className='mb-1'>Open AI API Key List</h4>
           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
           </div>
            <div>
                <Card className='nested-card p-1 mb-0'>
                    <CardBody>
                  <div className='d-flex justify-content-between align-items-center mb-1'>
                  <div className='d-flex vertical-align-middle'>
                  <h3 className='me-1'>Key 1</h3>
                  <span><Badge color='light-primary'>Active</Badge></span>
                  </div>
                  <span><MoreVertical size={15}></MoreVertical></span>
                  </div>
                  <div className='mb-1'>
                    <span className='me-1'>23eaf7f0-f4f7-495e-8b86-fad3261282ac</span>
                    <span><Copy size={15}/></span>
                  </div>
                  <div>
                    <small>Added on 28 Apr 2021, 10:00</small>
                  </div>
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
                className='dataTable-select'
                type='select'
                id='sort-select'
                // value={rowsPerPage}
                // onChange={e => handlePerPage(e)}
              >
                <option value={7}>7</option>
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
            <Button color="primary" onClick={() => setSiteModal(!siteModal)}><span className='me-50'><Plus size={15}/></span><span>Add New </span></Button>
            </div>
            </div>
         
        <div className='react-dataTable'>
          <DataTable
            noHeader
            className='react-dataTable'
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            data={data}
          />
        </div>
      </Card>
    <KeyEditModal keyModal={keyModal} setKeyModal={setKeyModal}/>
    <AddSite siteModal={siteModal} setSiteModal={setSiteModal}/>
    </div>
  )
}

export default Settings
