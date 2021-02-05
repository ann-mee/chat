import React from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase'

import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm'
import Message from './Message'
import { connect } from 'react-redux'

class Messages extends React.Component{
    state = {
        messagesRef: firebase.database().ref('messages'),
        messages: [],
        messagesLoading: true
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.channel || this.props.channel.id !== prevProps.channel.id) {
            this.addListeners(this.props.channel.id)    
        }
    }

    addListeners = channelId => {
        this.setState({messages: []})
        this.addMessageListener(channelId)
    }

    addMessageListener = channelId => {
        let loadedMessages = []
      
        this.state.messagesRef.child(channelId).on('child_added', snapshot => {
            loadedMessages.push(snapshot.val())
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })
        })
    }

    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message 
                key={message.timestamp} 
                message={message} 
                user={this.props.user}
            />
        ))
    )

    render(){
        const { messages } = this.state

        return(
            <React.Fragment>

                <MessagesHeader />

                <Segment>
                    <Comment.Group className="messages">
                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessagesForm />

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.currentUser,
    channel: state.channel.currentChannel
})

export default connect(mapStateToProps)(Messages)