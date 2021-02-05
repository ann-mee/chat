import React from 'react'
import mime from 'mime-types'
import { Modal, Input, Button, Icon } from 'semantic-ui-react'

class FileModal extends React.Component{
    state = {
        file: null,
        authorized: ['image/jpeg', 'image/png']
    }

    handleChange = event => {
        const file = event.target.files[0]
        if (file){
            this.setState({
                file: event.target.files[0]
            })
        }
    }

    sendFile = () => {
        const { file } = this.state
        const { uploadFile, closeModal } = this.props

        if (file !== null){
            if (this.isAuthorized(file.name)){
                const metadata = { contentType: mime.lookup(file.name) }
                uploadFile(file, metadata)
                closeModal()
                this.clearFile()
            }
        }
    }

    isAuthorized = filename => this.state.authorized.includes(mime.lookup(filename))

    clearFile = () => this.setState({file: null})

    render(){
        const {modal, closeModal} = this.props

        return(
            <Modal open={modal} onClose={closeModal}>
                <Modal.Header>Select an image</Modal.Header>
                <Modal.Content>
                    <Input 
                        fluid
                        label="types: jpg, png"
                        name="file"
                        type="file"
                        onChange={this.handleChange}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        color="green"
                        inverted
                        onClick={this.sendFile}
                    >
                        <Icon name="checkmark" /> Send
                    </Button>
                    <Button 
                        color="red"
                        inverted
                        onClick={closeModal}
                    >
                        <Icon name="cancel" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default FileModal