import "./Filter.scss";
import { Col, Row, Button } from "antd";
import IMG from '../../../../../assets/photo-3-1485152074061.jpg';
import { Link } from 'react-router-dom';

const Filter = () => {
    return (
        <Row justify="center" align="middle" className="Home-layout">
            <Col xs={24} md={12} className="Card-container-home">
                <span className="Bagde-card-container-home">Book With Us!</span>
                <h1 className="title-card-container-home">
                    You're<span> faraway traveler</span> who doesn't tell me where you want to be taken to. <br />
                </h1>
            </Col>
            <Col xs={24} md={11} className="Card-container-img">
                <img src={IMG} />
            </Col>
            <Button className="search-layout-home text-gradient"><Link to={`/view-hotels`}>Go to hotel list</Link></Button>
        </Row>
    );
};

export default Filter;
