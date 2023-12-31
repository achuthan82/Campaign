// ** React Imports
import { Fragment, lazy } from "react"
import { Navigate } from "react-router-dom"
// ** Layouts
import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import HorizontalLayout from "@src/layouts/HorizontalLayout"
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper"

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute"

// ** Utils
import { isObjEmpty } from "@utils"
import Dashboard from "../../views/Dashboard"
import Settings from "../../views/Settings"
import User from "../../views/users/User"
import SingleCampaign from "../../views/SingleCampaign"
// import OrderSummary from "../../views/OrderSummary"
// import OrderStates from "../../views/OrderStates"
// import StateDetails from "../../views/StateDetails"
// import CheckoutModified from "../../views/home/CheckoutModified"
// import Notification from "../../views/Notification"
// import PdfGenerator from "../../views/PdfGenerator"
// import FaqCrud from "../../views/Faq/FaqCrud"
// import FaqView from "../../views/Faq/FaqView"

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
}

// ** Document title
const TemplateTitle = "%s - IVR - Market Place"

// ** Default Route
const DefaultRoute = "/dashboard"

const Login = lazy(() => import("../../views/Login"))
const Register = lazy(() => import("../../views/Register"))
const MailVerification = lazy(() => import("../../views/MailVerification"))
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"))
const ResetPassword = lazy(() => import("../../views/ResetPassword"))
const Error = lazy(() => import("../../views/Error"))

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/login/:token",
    element: <Login />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/register/:token",
    element: <Register />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/verification/:token",
    element: <MailVerification />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank"
    }
  },
  {
    path:'/dashboard',
    element:<Dashboard/>
  },
  {
    path:'/dashboard/:id',
    element:<SingleCampaign/>
  },
  {
    path:'/settings',
    element:<Settings/>
  },
  {
    path:'/users',
    element:<User/>
  }


]

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false)
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical"
  const layouts = ["vertical", "horizontal", "blank"]

  const AllRoutes = []

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
