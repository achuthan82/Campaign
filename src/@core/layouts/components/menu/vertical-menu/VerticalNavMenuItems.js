// ** Vertical Menu Components
import VerticalNavMenuLink from "./VerticalNavMenuLink"
import VerticalNavMenuGroup from "./VerticalNavMenuGroup"
import VerticalNavMenuSectionHeader from "./VerticalNavMenuSectionHeader"

// ** Utils
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from "@layouts/utils"

// ** Utils
// import { getHomeRouteForLoggedInUser } from '@utils'
// import { getRole, getUserData } from '@utils'

const VerticalMenuNavItems = (props) => {
  // ** Components Object
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader
  }

  // ** Render Nav Menu Items
  const RenderNavItems = props.items.map((item, index) => {
    const TagName = Components[resolveNavItemComponent(item)]
    if (item.children) {
      return (
        canViewMenuGroup(item) && (
          <TagName item={item} index={index} key={item.id} {...props} />
        )
      )
    }
    return <TagName key={item.id || item.header} item={item} {...props} />
  })

  // const user = getUserData()

  // ** Render Nav Menu Items
  // const RenderNavItems = props.items.map((item, index) => {
  //   const TagName = Components[resolveNavItemComponent(item)]
  //   if (item.children && item.visible.includes(getRole(user?.dt?.role_id))) {
  //     return (
  //       canViewMenuGroup(item) && (
  //         <TagName item={item} index={index} key={item.id} {...props} />
  //       )
  //     )
  //   } else if (item.visible.includes(getRole(user?.dt?.role_id))) {
  //     return <TagName key={item.id || item.header} item={item} {...props} />
  //   } else return null
  // })

  return RenderNavItems
}

export default VerticalMenuNavItems
