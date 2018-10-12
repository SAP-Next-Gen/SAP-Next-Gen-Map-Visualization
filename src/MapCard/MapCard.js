import React, { Component } from 'react';
import ReactMapboxGl, { Cluster, Marker, ZoomControl } from "react-mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import PropTypes from 'prop-types';


class MapCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapObject: ReactMapboxGl({
                accessToken: process.env.REACT_APP_MAPBOX_KEY,
                attributionControl: false,
            }),
        };
    }

    clusterMarker = (coordinates, pointCount) => {
        let style = {
            width: 2* pointCount,
            height: 2* pointCount,
            borderRadius: "50%",
            display: "flex",
            backgroundColor: "#bbb",
            justifyContent: "center",
            alignItems: "center",
        };

        return (
            <Marker key={coordinates[0] + coordinates[1]} coordinates={coordinates}>
                <div style={style}>
                    { pointCount }
                </div>
            </Marker>
        )
    }

    // change Cluster with  Circle Layer (performance) --> https://www.mapbox.com/mapbox-gl-js/example/cluster/
    render() {
        return (
            <div className="MapContainer">
                <this.state.mapObject
                    // eslint-disable-next-line
                    style="mapbox://styles/mapbox/light-v9"
                    logoPosition = "bottom-right"
                    zoom={[ 2 ]}
                    containerStyle={{
                        height: "100vh",
                        width: "75vw",
                    }}
                >
                    <Cluster 
                        ClusterMarkerFactory={this.clusterMarker}
                        nodeSize={ 300 }
                        radius={ 120 }
                    >
                        {
                            this.props.mapMarkers.map((entry) => (
                                <Marker
                                    key={entry.id}
                                    coordinates={[entry.long, entry.lat]}
                                >
                                    M
                                </Marker>
                            ))
                        }
                    </Cluster>
                    <ZoomControl />
                </this.state.mapObject>
            </div>
        );
    }
}

MapCard.propTypes = {
    callbackSelectedEntryUpdated: PropTypes.func.isRequired,
    mapMarkers: PropTypes.array.isRequired,
}

export default MapCard;
