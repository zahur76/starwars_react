import './API.css'
import { useEffect, useState } from "react"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Modal from 'react-bootstrap/Modal';


function API(props) {

    // character detail modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [modalDetails, setModaldetails] = useState(<div>Zahur</div>)

    const [data, setData] = useState(null);
    const [masterData, setMasterData] = useState(null);
    // console.log(process.env.NODE_ENV)
    const [login, setLogin] = useState(localStorage.getItem("login")); 
    // const [lang, setLang] = useState(null);


    ///handle all flask messages login/logout
    const [flash, flashMessages] = useState(null)
    const [style, flashStyle] = useState(null)

    const handleFlashMessages = (message, error) =>{
        if(error){
            flashStyle('flash-messages text-light bg-danger')
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

    const debug = 'development'
    const [url] = useState(debug === 'development' ? 'http://127.0.0.1:8000/api/all_characters' : 'https://starwarsapi.hansolo.digital/api/all_characters')
    // https://starwarsapi.hansolo.digital/api/all_characters


    // render character depending on login status
    useEffect(() => {
        if(login){
            fetch(url).then((res) => res.json())
            .then((data) => [setData(data), setMasterData(data)]).catch((error) => {
                console.log(error)
            });
        }else{
            fetch(url).then((res) => res.json())
            .then((data) => [setData(data.slice(0,4)), setMasterData(data)]).catch((error) => {
                console.log(error)
            });
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //detect change login status to update view
    useEffect(() => {
        window.addEventListener('storage', () => {
            setLogin(localStorage.getItem('login'))
            if(!login){
                setData(masterData)
            }else{
                setData(masterData.slice(0,4))
            }                    
        })
        }, [data, login, masterData])
            
    // add faction to description
    const faction = (faction) => {
        if(faction===1){
            return 'Rebel Alliance'
        }else{
            return 'Galactic Empire'
        }              
    } 
    
    const handleCharacterDetails = (event) => {
        event.preventDefault()
        const characterId = event.currentTarget.id
        const accessToken = localStorage.getItem('token')
        fetch(`http://127.0.0.1:8000/api/character_details/${characterId}`, {method: 'GET', headers: {Authorization: `Bearer ${accessToken}`
          }}).then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                handleFlashMessages('Denied! Please Login.', 'error') 
            }else if(response.ok){
                setShow(true)
                console.log(data)
                setModaldetails(<Row className='text-center text-one'>
                                    <Col xs={12}><img src={data.image} alt={data.name} /></Col>
                                    <Col xs={12}>{data.name}</Col>
                                    <Col xs={12}>{data.gender}</Col>
                                    <Col xs={12}><span className='fw-bold'>Birth Year:</span> {data.birth_year}</Col>
                                    <Col xs={12}><span className='fw-bold'>Faction:</span> {faction(data.faction)}</Col>
                                </Row>)
            }       
        })
        .catch(error => {
            console.error('There was an error!', error);
        }); 
    }

    const handleMouseOver = (event) => {
        let imageId = event.currentTarget.id
        let element = document.getElementsByClassName(imageId)
        element[0].style.transform = 'scale(1.05)'
    }

    const handleMouseOut = (event) => {
        const imageId = event.currentTarget.getAttribute("id")
        let element = document.getElementsByClassName(imageId)
        element[0].style.transform = 'scale(1.0)'
        
    }


    const characterDetails = (data || []).map((element)=>                       
            <Col className="text-light mb-2 text-dark text-one p-0" id={element.id} xs={12} sm={6} md={4} lg={3} xl={2}  onMouseOut={handleMouseOut} onMouseOver={handleMouseOver}>
                <div className='border border-dark btn p-2 m-2 border-2 character-card' id={element.id} key={element.id} onClick={handleCharacterDetails}>
                    <div className="image-container"><img className={element.id} src={element.image} alt={element.name} /></div>              
                    <div className="h6 fw-bold">{element.name}</div>
                </div>                                                      
            </Col>
        )
        
    return (        
        <div>
            {flash ? <div className={style}>{flash}</div> : <div></div>}
            {!login ? <div className='text-center p-2 text-two h4'>Sign In for More Characters!</div> : <div></div>}
            <Row className='m-0 text-center mt-2'>
                {characterDetails}             
            </Row>

            <Modal show={show} onHide={handleClose} className='character-modal'>
                <Modal.Header className='border-0' closeButton>
                    <Modal.Title className='text-two'>Character Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalDetails}
                </Modal.Body>
            </Modal>
        </div>

        
    );
}

export default API;