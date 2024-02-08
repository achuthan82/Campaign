import React, {useEffect, useState} from 'react'
import { Badge, Card, Button } from 'reactstrap'
import apiConfig from '../configs/apiConfig'
import axios from 'axios'
import { getToken } from '@utils'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import ComponentSpinner from '@components/spinner/Loading-spinner'
import moment from "moment"
import { ArrowLeftCircle } from 'react-feather'
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
const SingleCampaign = () => {
 const params = useParams()
 const navigate = useNavigate()
 const [loading, setLoading] = useState(false)
 const [campaignData, setCampaignData] = useState([])
 console.log('params', params)
 const token = getToken()
 const getCampaignDetails = () => {
    setLoading(true)
    const config = {
        method: 'get',
        url: `${apiConfig.api.url}list_single_page/${params.id}?time_zone='asia/kolkata'`,
        headers: { 
          Authorization: `Token ${token}`
        }
      }
      axios(config).then((response) => {
        console.log('response', response)
        setLoading(false)
        if (response.data.status === 200) {
            setCampaignData(response.data.data)
        } else {
            toast.error(<ToastContent message={response.data.message} />, { duration:3000 })  
        }
      }).catch((error) => {
        setLoading(false)
        toast.error(<ToastContent message={error.message} />, { duration:3000 })  
      })
 }
 useEffect(() => {
    getCampaignDetails()
 }, [])
  return (
    <div>
        <div className='mb-1'>
          <Button color='primary' className='d-flex align-items-center' onClick={() => navigate('/campaign')}><ArrowLeftCircle size={18} className='me-50'/><span className=''>Go Back</span></Button>
        </div>
        {
            campaignData.length > 0 &&        <>
            <Card className='p-2 mb-1'>
              <div className='d-flex justify-content-between flex-wrap align-items-end border-bottom py-50 mb-1'>
              <div className='d-flex align-tems-end'>
              <h2 className='me-50' style={{lineHeight:'1.714rem'}}>{campaignData[0].post_title}</h2>
              <span><Badge pill color={campaignData[0].status === 'Active' ? 'light-success' : 'light-warning'}>{campaignData[0].status}</Badge></span>
              </div>
              <span className=''>Created At : {moment(campaignData[0].created_at, "ddd, DD MMM YYYY HH:mm:ss [GMT]").format('DD-MM-YYYY hh:mm A')}</span>
      
              </div>
              <div className='d-flex flex-wrap justify-content-between align-items-center'>
              <div>
                 <h4 className='mb-1'></h4>
                 {campaignData[0].category_info.map((item, index) => {
                    return (
                        <Badge color='primary' className='me-50' key={index}>{item.category_name}</Badge>
                    )
                 })}
                
              </div>
              <div className=''>
                  {/* <p className=''>Created At : Dec 18 11:55 am</p> */}
                  <span>Post Interval : {campaignData[0].post_interval}mins</span>
              </div>
              </div>
            </Card>
             <Card className='p-2'>
              <div>
                  <div className='mb-1 py-50 border-bottom'>
                    <h4>Post Title</h4>
                  </div>
                  <div className='mb-1'>
                  {campaignData[0].post_title}
                  </div>
                  <div className='mb-1 py-50 border-bottom'>
                    <h4>Questions</h4>
                  </div>
                  <div className='mb-1'>
                  {campaignData[0].questions}
                  </div>
                  <div className='mb-1 py-50 border-bottom'>
                    <h4>Post Content</h4>
                  </div>
                  <div className='mb-1'>
                  {campaignData[0].post_content}
                  </div>
                  <div className='mb-1 py-50 border-bottom'>
                    <h4>Prompt</h4>
                  </div>
                  <div className='mb-1'>
                  {campaignData[0].prompt}
                  </div>
                  { campaignData[0].url !== 'https://dall-e-article-images.s3.amazonaws.com/None' &&
                      <>
                      <div className='mb-1 py-50 border-bottom'>
                        <h4>Uploaded Image</h4>
                      </div>
                      <div className='mb-1'>
                      <img src={campaignData[0].url} alt="uploaded image" style={{width:'200px'}}></img>
                      </div>
                      </>
                  }
                
              </div>
             </Card>
             {loading && <ComponentSpinner txt="Loading.."/>}
             </>
        }
 
    </div>
  )
}

export default SingleCampaign
