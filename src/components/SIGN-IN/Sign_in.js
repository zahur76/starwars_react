import './Sign_in.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function SignIn(props) {

    return (
        <div>
            <Row className='m-0 bg-dark '>
                <Col className='h1 text-start' xs={12}><a className="text-decoration-none text-warning" href="/">StarWars API</a></Col>
            </Row>
            <div className='text-center h3 text-one text-dark mt-5'>Registration Successful! Go to <a className='text-decoration-none' href='/'>home</a> page!</div>
        </div>
        
    )
}

export default SignIn;