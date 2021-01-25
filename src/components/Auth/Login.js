import React from 'react'
import firebase from '../../firebase'

import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Login extends React.Component {

    state = {
        email: '',
        password: '',
        errors: [],
        loading: false
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault()
        if ( this.isFormValid(this.state) ){
            this.setState({ errors: [], loading: true})
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(response => {
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                    this.setState({ errors: this.state.errors.concat(error), loading: false })
                })
        }
    }

    isFormValid = ({ email, password }) => email && password

    displayErrors = errors => errors.map( (error, i) => <p key={i}>{error.message}</p>)

    handleInputErrors = (errors, name) => {
        return errors.some(error => error.message.toLowerCase().includes(name)) ? 'error' : ''
    }

    render(){
        const { email, password, errors, loading } = this.state
       
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="violet">
                        <Icon name="user circle outline" color="violet" />
                        Login to Chat
                    </Header>
                    {errors.length > 0 && (
                        <Message error>
                            <Message.Header>Errors</Message.Header>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment raised>
                           
                            <Form.Input fluid 
                                name="email" 
                                type="text" 
                                icon="mail" 
                                iconPosition="left" 
                                placeholder="Email Address" 
                                onChange={this.handleChange} 
                                value={email}
                                className={this.handleInputErrors(errors, 'email')}
                            />    

                            <Form.Input fluid 
                                name="password" 
                                type="password" 
                                icon="lock" 
                                iconPosition="left" 
                                placeholder="Password" 
                                onChange={this.handleChange} 
                                value={password}
                                className={this.handleInputErrors(errors, 'password')}
                            />

                            <Button disabled={loading} className={loading ? 'loading' : ''} fluid color="violet" size="large">Submit</Button>

                            <Message>Don't have an account? <Link to="/register">Register</Link></Message>

                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login