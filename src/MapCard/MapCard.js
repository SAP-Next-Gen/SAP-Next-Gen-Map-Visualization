import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, ZoomControl, Popup } from "react-mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';


class MapCard extends Component {
    render() { 
        let Map = ReactMapboxGl({
            accessToken: process.env.REACT_APP_MAPBOX_KEY,
            attributionControl: false,
        });

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

export default MapCard;
