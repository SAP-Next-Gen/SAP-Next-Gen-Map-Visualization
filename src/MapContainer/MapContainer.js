import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, ZoomControl, Popup } from "react-mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapContainer.css';

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1Ijoiam9uLWhlciIsImEiOiJjam12MjF5OHMwZGJyM3BydXRsbWg5eTNvIn0.p_VMyUydJ5Ke6610cboLVw",
    attributionControl: false,
});

class MapContainer extends Component {
    render() {
        return (
            <div className="MapContainer">
                <Map
                    // eslint-disable-next-line
                    style="mapbox://styles/mapbox/dark-v9"
                    logoPosition = "bottom-right"
                    containerStyle={{
                        height: "100vh",
                        width: "100vw",
                    }}
                >
                    <Layer
                        type="symbol"
                        id="marker"
                        layout={{ "icon-image": "marker-15" }}
                    >
                        <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
                    </Layer>
                    <ZoomControl />
                    <Popup
                        coordinates={[-0.13235092163085938,51.518250335096376]}
                    >
                        <h1>Popup</h1>
                    </Popup>
                </Map>
            </div>
        );
    }
}

export default MapContainer;
