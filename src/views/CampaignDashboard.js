import React, { useEffect, useState } from 'react'
import { Mic, Speaker, Users, Volume, Volume2 } from 'react-feather'
import { Card, Col, Row } from 'reactstrap'
import apiConfig from '../configs/apiConfig'
import axios from 'axios'
import { getToken, getUserData } from '@utils'
import { toast } from 'react-hot-toast'
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

const CampaignDashboard = () => {
 const token = getToken()
 const user = getUserData()
 const [activeCampaign, setActiveCampaign] = useState(0)
 const [totalCampaign, setTotalCampaign] = useState(0)
 const [userCount, setUserCount] = useState(0)
 const [loading, setLoading] = useState(false)
 const getDetails = () => {
    setLoading(true)
    const config = {
        method:'get',
        url: `${apiConfig.api.url}dashboard`,
        headers: { 
            Authorization: `Token ${token}`
          }
    }
    axios(config).then((response) => {
        console.log('response', response)
        setLoading(false)
        if (response.data.status === 200) {
            setActiveCampaign(response.data.data.active_camp)
            setTotalCampaign(response.data.data.total_campaigns)
            setUserCount(response.data.data.users_count)
        } else {
            toast.error(<ToastContent message={response.data.message}/>)
        }
    }).catch((error) => {
        setLoading(false)
        toast.error(<ToastContent message={error.message}/>)
 
    })
 }
 useEffect(() => {
    getDetails()
 }, [])
  return (
    <div>
      <Row>
        {
            user && user.dt && user.dt.role_id === 1 &&   <Col xs={12}>
            <Card className='p-1 user-card'>
                <h4 style={{color:'#FFFFFF'}}>Total Users</h4>
                <div className='mt-1 d-flex justify-content-between align-items-end'>
                 <h1 className='mb-0' style={{fontSize:'3.5rem', color:'#FFFFFF', lineHeight:'1.1'}}>{userCount}</h1>
                 <span><Users size={70}/></span>
                </div>
            </Card>
        </Col>
        }
      
        <Col xs={12}>
            <Card className='p-1 campaign-card'>
                <h4 style={{color:'#462E95'}}>Total Campaigns</h4>
                <div className='mt-1 d-flex justify-content-between align-items-end'>
                 <h1 className='mb-0' style={{fontSize:'3.5rem', color:'#462E95', lineHeight:'normal'}}>{totalCampaign}</h1>
                 <span><Volume size={70}/></span>
                </div>
            </Card>
        </Col>
        <Col xs={12}>
            <Card className='p-1 user-card'>
                <h4 style={{color:'#FFFFFF'}}>Active Campaigns</h4>
                <div className='mt-1 d-flex justify-content-between align-items-end'>
                 <h1 className='mb-0' style={{fontSize:'3.5rem', color:'#FFFFFF', lineHeight:'normal'}}>{activeCampaign}</h1>
                 <span><Volume2 size={70}/></span>
                </div>
            </Card>
        </Col>
      </Row>
      {loading && <ComponentSpinner txt="Loading.."/>}
    </div>
  )
}

export default CampaignDashboard
