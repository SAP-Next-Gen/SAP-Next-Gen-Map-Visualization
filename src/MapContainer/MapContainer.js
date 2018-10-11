import React, { Component } from 'react';
import { Container, Row, Col } from "reactstrap";
import InfoCard from "../InfoCard/InfoCard";
import HeaderCard from "../HeaderCard/HeaderCard";
import MapCard from "../MapCard/MapCard";
import './MapContainer.css';


class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nextGenPartners: [],
            selectedPartner: '',
        };
    }

    handlePartnersChanged = (entryList) => {
        this.setState({
            nextGenPartners: entryList,
        });
    }

    render() {
        return (
            <Container className="MapContainer">
                <Row>
                    <Col xs="3">
                        <Row>
                            <HeaderCard callbackEntriesUpdated={ this.handlePartnersChanged } />
                        </Row>
                        <Row>
                            <InfoCard />
                        </Row>
                    </Col>
                    <Col xs="9">
                        <MapCard />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default MapContainer;
