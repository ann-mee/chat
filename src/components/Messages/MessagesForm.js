import React from 'react'
import firebase from '../../firebase'
import uuid from 'uuid-v4'
import { Segment, Button, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'

import FileModal from './FileModal'
import ProgressBar from './ProgressBar'

class MessagesForm extends React.Component{
    state = {
        uploadState: '',
        uploadTask: null,
        percentUploaded: 0,
        storageRef: firebase.storage().ref(),
        messagesRef: firebase.database().ref('messages'),
        message: '',
        loading: false,
        errors: [],
        modal: false
    }

    openModal = () => this.setState({modal: true})

    closeModal = () => this.setState({modal: false})

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.props.user.uid,
                name: this.props.user.displayName,
                avatar: this.props.user.photoURL
            }
        }
        if (fileUrl !== null){
            message['image'] = fileUrl
        }
        else{
            message['content'] = this.state.message
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

    uploadFile = (file, metadata) => {
        const pathToUpload = this.props.channel.id
        const ref = this.state.messagesRef
        const filePath = `chat/public/${uuid()}.jpg`

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
            () => {
                this.state.uploadTask.on('state_changed', snapshot => {
                    const percentUploaded = Math.round(( snapshot.bytesTransferred / snapshot.totalBytes ) * 100)
                    this.setState({ percentUploaded: percentUploaded })
                },
                    error => {
                        console.log(error)
                        this.setState({
                            errors: this.state.errors.concat(error),
                            uploadState: 'error',
                            uploadTask: null
                        })
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl =>{
                            this.sendFileMessage(downloadUrl, ref, pathToUpload)
                        })
                        .catch(error =>{
                            console.log(error)
                            this.setState({
                                errors: this.state.errors.concat(error),
                                uploadState: 'error',
                                uploadTask: null
                            })
                        })
                    }
                )
            }
        )
    }

    sendFileMessage = (downloadUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(downloadUrl))
            .then(()=>{
                this.setState({uploadState: 'done'})
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    errors: this.state.errors.concat(error)
                })
            })
    }

    render(){
        const { errors, message, loading, modal, percentUploaded, uploadState } = this.state
        
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
                        onClick={this.openModal}
                    />
                </Button.Group>
                <FileModal 
                    modal={modal}
                    closeModal={this.closeModal}
                    uploadFile={this.uploadFile}
                />
                <ProgressBar 
                    percentUploaded={percentUploaded} 
                    uploadState={uploadState}
                />
            </Segment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.currentUser,
    channel: state.channel.currentChannel
})

export default connect(mapStateToProps)(MessagesForm)