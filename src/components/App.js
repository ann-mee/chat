import React from 'react'
import './App.css'

import { Grid } from 'semantic-ui-react'

import ColorPanel from './ColorPanel'
import SidePanel from './SidePanel'
import Messages from './Messages'
import MetaPanel from './MetaPanel'

const App = () => (
  <Grid columns="equal" className="app">

    <ColorPanel />

    <SidePanel />

    <Grid.Column style={{ marginLeft:320 }}>
      <Messages />
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel />
    </Grid.Column>  
    
  </Grid>
)

export default App