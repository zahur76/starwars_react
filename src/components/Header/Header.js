import './Header.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey, faMailReply} from '@fortawesome/free-solid-svg-icons'

import { useEffect, useState } from "react"
// import { faUserSecret } from '@fortawesome/free-solid-svg-icons';


function Header(props) {

    // modal open close
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [RegisterShow, setRegisterShow] = useState(false);
    const handleRegisterClose = () => setRegisterShow(false);
    const handleRegisterShow = () => setRegisterShow(true);

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [login, setLogin] = useState(localStorage.getItem("login") ? true : false);

    const [RegUsername, setRegUsername] = useState(null);
    const [RegEmail, setRegEmail] = useState(null);
    const [RegPassword, setRegPassword] = useState(null);
    const [RegPasswordConfirm, setRegPasswordConfirm] = useState(null);
   

    //handle all flask messages login/logout
    const [flash, flashMessages] = useState(null)
    const [style, flashStyle] = useState(null)

    const handleFlashMessages = (message, error) =>{
        if(error){
            flashStyle('flash-messages text-danger')
            flashMessages(message)
            setTimeout(() => {
                flashMessages(null)
            }, 3000);

        }else{
            flashStyle('flash-messages')
            flashMessages(message)
            setTimeout(() => {
                flashMessages(null)
            }, 3000);
        }        
    }

    const [accessToken, setAccessToken] = useState(null);

    // handle login
    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }   

    const handleLoginSubmit = (e) => {
        e.preventDefault()
        let data = {'username': username, 'password': password}
        fetch('http://127.0.0.1:8000/dj-rest-auth/login/', {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(data)}).then(async response => {
            const data = await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                setShow(false)
                handleFlashMessages('Incorrect Username/password!', 'error')                
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
    
    // handle registration
    const handleRegistrationUsername= (event) => {
        setRegUsername(event.target.value)
    }

    const handleRegistrationEmail = (event) => {
        setRegEmail(event.target.value)
    }

    const handleRegistrationPassword = (event) => {
        setRegPassword(event.target.value)
    }

    const handleRegistrationPasswordConfirm = (event) => {
        setRegPasswordConfirm(event.target.value)
    } 

    const handleRegisterSubmit = (e) => {
        e.preventDefault()
        let data = { 'username': RegUsername,
                     'email': RegEmail,
                     'password1': RegPassword,
                     'password2': RegPasswordConfirm}
        
        fetch('http://127.0.0.1:8000/dj-rest-auth/registration/', {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(data)}).then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                console.log(data)
                let errors = '';
                for(var keys in data){
                    var elements = data[keys];
                    console.log(elements[0]);
                    errors += elements[0]
                }
                setRegisterShow(false)
                handleFlashMessages(errors, 'error') 
            }else if(response.ok){
                setRegisterShow(false)
                handleFlashMessages(`Please Check email ${RegEmail} to confirm account`) 
            }       
        })
        .catch(error => {
            console.error('There was an error!', error);
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
            {flash ? <div className={style}>{flash}</div> : <div></div>}  
            <Row className='m-0 bg-dark '>
                <Col className='h1 text-start' xs={7} md={10}><a className="text-decoration-none text-warning" href="/">StarWars API</a></Col>
                <Col className='h6 text-end text-warning my-auto btn' xs={5} md={2}>
                    {login ? <div className="d-inline p-2" onClick={handleLogout}>Logout</div> : <div className="d-inline p-2" onClick={handleShow}>Login</div>}
                    <div className='d-inline' onClick={handleRegisterShow}>Register</div>
                </Col>
            </Row>
            {/* Login Modal */}
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
            {/* Registration Modal */}
            <Modal show={RegisterShow} onHide={handleRegisterClose} className='register-modal'>
                <Modal.Header className='border-0' closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleRegisterSubmit}>                    
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                    <Form.Control
                    placeholder="Username"
                    aria-label="Username"
                    username={username} onChange={handleRegistrationUsername} aria-describedby="basic-addon1" required/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faMailReply} /></InputGroup.Text>
                    <Form.Control
                    placeholder="Email"
                    aria-label="Username"
                    type='email'
                    username={username} onChange={handleRegistrationEmail} aria-describedby="basic-addon1" required/>
                    </InputGroup>                  
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faKey} /></InputGroup.Text>
                    <Form.Control
                    placeholder="Password"
                    aria-label="Username"
                    type="password"
                    password={password} onChange={handleRegistrationPassword} aria-describedby="basic-addon1" required/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faKey} /></InputGroup.Text>
                    <Form.Control
                    placeholder="Confirm Password"
                    aria-label="Username"
                    type="password"
                    password={password} onChange={handleRegistrationPasswordConfirm} aria-describedby="basic-addon1" required/>
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