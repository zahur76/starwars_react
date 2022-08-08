import './API.css'
import { useEffect, useState } from "react"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


function API(props) {
    
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("https://starwarsapi.hansolo.digital/api/all_characters").then((res) => res.json())
        .then((data) => [setData(data), console.log(data)]).catch((error) => {
            console.log(error);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(data)
    const characterDetails = (data || []).map((element)=>                       
            <Col className="text-light mb-2" key={element.id} xs={12} sm={6} md={4} lg={3}>                
                <div className="h4 text-info">{element.name}</div>
                <div className="h4 text-info">{element.gender}</div> 
                <div className="h4 text-info">{element.birth_year}</div>
                <div className="h4 text-info">{element.faction}</div>                                              
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