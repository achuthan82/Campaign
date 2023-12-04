// ** Router imports
import { lazy } from 'react'

// ** Router imports
import { useRoutes, Navigate } from 'react-router-dom'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'

// ** Utils
// import { getUserData } from '@utils'
import { getUserData, getHomeRouteForLoggedInUser } from '@utils'

// ** GetRoutes
import { getRoutes } from './routes'

// ** Components
const Error = lazy(() => import('../views/Error'))
const NotAuthorized = lazy(() => import('../views/NotAuthorized'))

const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)
  const getHomeRoute = () => {
    const user = getUserData()
    // console.log(user)
    if (user && user.dt && user.dt.role_id) {
     
      return getHomeRouteForLoggedInUser(user.dt.role_id)
      // return getHomeRouteForLoggedInUser(user.role_id)
    } else {
      return '/login'
    }
  }

  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    // {
    //   path: '/login',
    //   element: <BlankLayout />,
    //   children: [{ path: '/login', element: <Login /> }]
    // },
    {
      path: '/auth/not-auth',
      element: <BlankLayout />,
      children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
    },
    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Error /> }]
    },
    ...allRoutes
  ])

  return routes
}

export default Router