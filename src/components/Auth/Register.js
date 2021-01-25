import React from 'react'
import firebase from '../../firebase'
import md5 from 'md5'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Register extends React.Component {

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault()
        if ( this.isFormValid() ){
            this.setState({ errors: [], loading: true})
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(response => {
                    console.log(response)
                    response.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(response.user.email)}?d=identicon`
                    })
                    .then(() => {
                        this.saveUser(response).then(() => {
                            console.log('user saved')
                        })
                    })
                    .catch(error => {
                        this.setState({ errors: this.state.errors.concat(error), loading: false })
                    })
                })
                .catch(error => {
                    //console.error(typeof [].concat(error))
                    this.setState({ errors: this.state.errors.concat(error), loading: false })
                })
        }
    }

    isFormValid = () => {
        let errors = []
        let error

        if ( this.isFormEmpty(this.state) ){
            error = {message: 'Fill in all fields'}
            this.setState({ errors: errors.concat(error)})
            return false
        } else if ( !this.isPasswordValid(this.state) ){
            error = {message: 'Password is invalid'}
            this.setState({ errors: errors.concat(error)})
            return false
        } else{
            return true
        }
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length
    }

    isPasswordValid = ({ password, passwordConfirmation}) => {
        if (password.length < 6 || passwordConfirmation.length < 6){
            return false
        } else if (password !== passwordConfirmation){
            return false
        } else{
            return true
        }
    }

    displayErrors = errors => errors.map( (error, i) => <p key={i}>{error.message}</p>)

    handleInputErrors = (errors, name) => {
        return errors.some(error => error.message.toLowerCase().includes(name)) ? 'error' : ''
    }

    saveUser = newUser => {
        return this.state.usersRef.child(newUser.user.uid).set({
            name: newUser.user.displayName,
            avatar: newUser.user.photoURL
        })
    }


    render(){
        const { username, email, password, passwordConfirmation, errors, loading } = this.state
       
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="blue">
                        <Icon name="puzzle" color="blue" />
                        Register for Chat
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
                                name="username" 
                                type="text" 
                                icon="user" 
                                iconPosition="left" 
                                placeholder="User name" 
                                onChange={this.handleChange} 
                                value={username}
                            />

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

                            <Form.Input fluid 
                                name="passwordConfirmation" 
                                type="password" 
                                icon="repeat" 
                                iconPosition="left" 
                                placeholder="Password confirmation" 
                                onChange={this.handleChange} 
                                value={passwordConfirmation}
                                className={this.handleInputErrors(errors, 'password')}
                            />  

                            <Button disabled={loading} className={loading ? 'loading' : ''} fluid color="blue" size="large">Submit</Button>

                            <Message>Already a user? <Link to="/login">Login</Link></Message>

                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register