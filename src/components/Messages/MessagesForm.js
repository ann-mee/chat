import React from 'react'
import firebase from '../../firebase'
import { Segment, Button, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'

class MessagesForm extends React.Component{
    state = {
        messagesRef: firebase.database().ref('messages'),
        message: '',
        loading: false,
        errors: []
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.props.user.uid,
                name: this.props.user.displayName,
                avatar: this.props.user.photoURL
            },
            content: this.state.message
        }

        return message
    }

    sendMessage = () => {
        const { message, messagesRef } = this.state
        const { channel } = this.props

        if (message){
            this.setState({loading: true})
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({loading: false, message: '', errors: []})
                })
                .catch(error => {
                    console.log(error)
                    this.setState({loading: false, errors: this.state.errors.concat(error) })
                })
        }
        else{
            this.setState({errors: this.state.errors.concat({message: 'Add a message'})})
        }
    }

    render(){
        const { errors, message, loading } = this.state
        
        return (
            <Segment className="message__form">
                <Input 
                    fluid 
                    name="message"
                    value={message}
                    style={{ marginBottom: '0.7em'}}
                    label={<Button icon={'add'} />}
                    labelPosition="left"
                    placeholder="write your message"
                    className={
                        errors.some(error => error.message.includes('message')) ? 'error': ''
                    }
                    onChange={this.handleChange}
                />
                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        content="Add reply"
                        labelPosition="left"
                        icon="edit"
                        onClick={this.sendMessage}
                        disabled={loading}
                    />
                    <Button
                        color="teal"
                        content="Upload media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
            </Segment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.currentUser,
    channel: state.channel.currentChannel
})

export default connect(mapStateToProps)(MessagesForm)