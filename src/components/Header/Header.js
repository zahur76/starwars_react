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
    // modal open close
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [login, setLogin] = useState(false);
   

    // login status
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
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
        setAccessToken(data['access_token'])
        localStorage.setItem("login", true)
        setLogin(true)
        setShow(false)
        })
        .catch(error => {
            console.error('There was an error!', error);
            console.log('Error login credentials')
        });
    }

    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.setItem("login", false)
        setLogin(false)
    }

    return (
        <div>
            <Row className='m-0 bg-dark '>
                <Col className='h1 text-start text-warning' xs={8}>StarWars API</Col>
                <Col className='h6 text-end text-warning my-auto btn' xs={4} >
                {login===true ? <div onClick={handleLogout}>Logout</div> : <div onClick={handleShow}>Login</div>}
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