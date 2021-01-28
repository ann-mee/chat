import React from 'react'
import { Menu } from 'semantic-ui-react'

import UserPanel from './UserPanel'
import Channels from './Channels'

class SidePanel extends React.Component{
    render(){
        return(
            <Menu
                size="large"
                inverted
                fixed="left"
                vertical
                style={{ backgroundColor: '#36484d' }}
            >
                <UserPanel />
                <Channels />
            </Menu>
        )
    }
}

export default SidePanel