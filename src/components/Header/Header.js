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


    return (
        <div>
            <Row className='m-0 bg-dark '>
                <Col className='h1 text-start text-warning' xs={8}>StarWars API</Col>
                <Col className='h6 text-end text-warning my-auto btn' xs={4} onClick={handleShow}>
                        Login
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header className='border-0' closeButton>
                    <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>                    
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                    <Form.Control
                    placeholder="Username or Email"
                    aria-label="Username"
                    aria-describedby="basic-addon1" required/>
                    </InputGroup>                    
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faKey} /></InputGroup.Text>
                    <Form.Control
                    placeholder="Password"
                    aria-label="Username"
                    aria-describedby="basic-addon1" required/>
                    </InputGroup>
                    <Button variant="dark" className="btn-sm" ype="submit">
                        Submit
                    </Button>
                </Form>
                </Modal.Body>
            </Modal>
        </div>

        
    );
}

export default Header;