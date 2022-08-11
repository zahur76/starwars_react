import './API.css'
import { useEffect, useState } from "react"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


function API(props) {
    const [data, setData] = useState(null);
    const [masterData, setMasterData] = useState(null);
    // console.log(process.env.NODE_ENV)
    const [login, setLogin] = useState(localStorage.getItem("login")); 
    // const [lang, setLang] = useState(null);

    const debug = 'development'
    const [url] = useState(debug === 'development' ? 'http://127.0.0.1:8000/api/all_characters' : 'https://starwarsapi.hansolo.digital/api/all_characters')
    // https://starwarsapi.hansolo.digital/api/all_characters

    useEffect(() => {
        fetch(url).then((res) => res.json())
        .then((data) => [setData(data.slice(0,4)), setMasterData(data)]).catch((error) => {
            console.log(error)
        });
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
        }, [data, login, masterData, url])

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
        fetch(`http://127.0.0.1:8000/api/character_details/${characterId}`, {method: 'GET', headers: {
            Authorization: `Bearer ${accessToken}`
          }}).then((res) => res.json())
          .then((data) => console.log(data)).catch((error) => {
              console.log(error);
        }); 
    }
    const characterDetails = (data || []).map((element)=>                       
            <Col className="text-light mb-2 text-dark btn" id={element.id} key={element.id} xs={12} sm={6} md={4} lg={3} onClick={handleCharacterDetails}>
                <div className="image-container"><img src={element.image} alt={element.name} /></div>              
                <div className="h6">{element.name}</div>
                <div className="h6">{element.gender}</div> 
                <div className="h6">{element.birth_year}</div>
                <div className="h6">{faction(element.faction)}</div>                                              
            </Col>
        )   
    return (        
        <div>
            <div className='text-center'>API REQUESTS</div>
            <Row className='m-0 text-center mt-4'>
                {characterDetails}             
            </Row>
        </div>
    );
}

export default API;