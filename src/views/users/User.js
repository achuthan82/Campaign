import React, {useState} from 'react'
import { Plus } from 'react-feather'
import { Button } from 'reactstrap'
import AddUser from './AddUser'

const User = () => {
    const [modalOpen, setModalOpen] = useState(false)
  return (
    <div>
        <div className='d-flex justify-content-between'>
           <h1>Users</h1>
           <Button color='primary' onClick={() => setModalOpen(true)}><span className='me-50'><Plus size={15}/></span> Add User</Button>
        </div>
      <AddUser modalOpen={modalOpen} setModalOpen={setModalOpen}></AddUser>
    </div>
  )
}

export default User
