import './Header.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons'

import { useEffect, useState } from "react"
// import { faUserSecret } from '@fortawesome/free-solid-svg-icons';


function Header(props) {

    // flash messages
    const [flash, flashMessages] = useState(null)


    // modal open close
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [login, setLogin] = useState(localStorage.getItem("login") ? true : false);
   

    //handle all flask messages login/logout
    const handleFlashMessages = (message) =>{
        flashMessages(message)
        setTimeout(() => {
            flashMessages(null)
        }, 3000);
    }

    const [accessToken, setAccessToken] = useState(null);

    // handle login form
    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }    

    //handle login

    const handleLoginSubmit = (e) => {
        e.preventDefault()
        let data = {'username': username, 'password': password}
        fetch('http://127.0.0.1:8000/dj-rest-auth/login/', {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(data)}).then(async response => {
            const data = await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                setShow(false)
                handleFlashMessages('Incorrect Username/password!')                
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
        
        setAccessToken(data['access_token'])
        localStorage.setItem('token', data['access_token'])     
        setLogin(true) // update state to change element
        localStorage.setItem("login", 'true')
        setShow(false)
        window.dispatchEvent(new Event("storage"));
        handleFlashMessages('Login Successful!')
        })
        .catch(error => {
            console.error('There was an error!', error);
            console.log('Error login credentials')
        });
    }

    // handle logout
    const handleLogout = (e) => {
        e.preventDefault()
        fetch('http://127.0.0.1:8000/dj-rest-auth/logout/', {method: 'POST', headers: {
            Authorization: accessToken
          }}).then((res) => [res.status===200 ? [handleFlashMessages('Logout Successful!'), localStorage.removeItem('login'), localStorage.removeItem('token'), setLogin(null), window.dispatchEvent(new Event("storage"))] : console.log('poo')]
            ).catch((error) => {
            console.log(error)
        }, [])
    }
    return (        
        <div>
            {flash ? <div className="flash-messages">{flash}</div> : <div></div>}   
            <Row className='m-0 bg-dark '>
                <Col className='h1 text-start' xs={8}><a className="text-decoration-none text-warning" href="/">StarWars API</a></Col>
                <Col className='h6 text-end text-warning my-auto btn' xs={4} >
                {login ? <div onClick={handleLogout}>Logout</div> : <div onClick={handleShow}>Login</div>}
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose} className='login-modal'>
                <Modal.Header className='border-0' closeButton>
                    <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleLoginSubmit}>                    
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                    <Form.Control
                    placeholder="Username or Email"
                    aria-label="Username"
                    username={username} onChange={handleUsernameChange} aria-describedby="basic-addon1" required/>
                    </InputGroup>                    
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faKey} /></InputGroup.Text>
                    <Form.Control
                    placeholder="Password"
                    aria-label="Username"
                    type="password"
                    password={password} onChange={handlePasswordChange} aria-describedby="basic-addon1" required/>
                    </InputGroup>
                    <Button variant="dark" className="btn-sm" type="submit">
                        Submit
                    </Button>
                </Form>
                </Modal.Body>
            </Modal>
        </div>

        
    );
}

export default Header;