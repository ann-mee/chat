import React from 'react'
import firebase from '../../firebase'
import { connect } from 'react-redux'
import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react'

class UserPanel extends React.Component{
    state = {
        user: null
    }

    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Sign in as <strong>{this.props.user ? this.props.user.displayName : ''}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSignOut}>Sign out</span>
        }
    ]

    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('sign out'))
    }


    render(){
        console.log(this.props.user)
        return(
            <Grid>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0}}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="pencil alternate" />
                            <Header.Content>Chat</Header.Content>
                        </Header>
                        <Header style={{ padding: '0.25em'}} as="h4" inverted>
                            <Dropdown 
                                trigger={
                                    <span>
                                        <Image src={this.props.user.photoURL} spaced="right" avatar />
                                        {this.props.user ? this.props.user.displayName : ''}
                                    </span>
                                }
                                options={this.dropdownOptions()}
                            />
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.currentUser
  })

export default connect(mapStateToProps)(UserPanel)