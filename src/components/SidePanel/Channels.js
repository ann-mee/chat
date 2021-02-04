import React from 'react'
import { Icon, Menu, Modal, Form, Input, Button } from 'semantic-ui-react'
import firebase from '../../firebase'
import { connect } from 'react-redux'
import { setCurrentChannel } from '../../actions'

class Channels extends React.Component{
    state = {
        activeChannel: '',
        channels: [],
        channelName: '',
        channelDetails: '',
        channelRef: firebase.database().ref('channels'),
        modal: false,
        firstLoad: true
    }

    componentDidMount(){
        this.addListeners()
    }

    componentWillUnmount(){
        this.removeListeners()
    }

    addListeners = () => {
        let loadedChannels = []
        this.state.channelRef.on('child_added', snapshot => {
            loadedChannels.push(snapshot.val())
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel() )
        })
    }

    removeListeners = () => {
        this.state.channelRef.off()
    }

    setFirstChannel = () => {
        if (this.state.firstLoad && this.state.channels.length > 0){
            const firstChannel = this.state.channels[0]
            this.props.setCurrentChannel(firstChannel)
            this.setActiveChannel(firstChannel)
        }
        this.setState({firstLoad: false})
    }

    openModal = () => this.setState({modal: true})
    
    closeModal = () => this.setState({modal: false})

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault()
        if (this.isFormValid(this.state)){
            this.addChannel()
        }
    }

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails

    addChannel = () => {
        const { channelRef, channelName, channelDetails } = this.state
        const { user } = this.props

        const key = channelRef.push().key
    
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }
        
        channelRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({channelName: '', channelDetails: ''})
                this.closeModal()
                console.log('added')
            })
            .catch(error => {
                console.log(error)
            })
    }

    displayChannels = channels => (
        channels.length > 0 && 
        channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ))
    )

    changeChannel = channel => {
        this.setActiveChannel(channel)
        this.props.setCurrentChannel(channel)
    }

    setActiveChannel = channel => this.setState({ activeChannel: channel.id })

    render(){
        const { channels, modal } = this.state

        return(
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em'}}>
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                        </span>{" "}
                        ({ channels.length }) <Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>

                <Modal open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input 
                                    fluid
                                    label="Name of channel"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input 
                                    fluid
                                    label="About the Channel"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark" /> Add
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}
const mapStateToProps = state => ({
    user: state.user.currentUser
})

export default connect(mapStateToProps, { setCurrentChannel })(Channels)