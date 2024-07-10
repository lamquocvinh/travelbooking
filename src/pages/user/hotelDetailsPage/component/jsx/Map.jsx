import "../scss/Map.scss"
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-geosearch/dist/style.css';
import 'leaflet-geosearch/assets/css/leaflet.css';

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const Map = ({ data }) => {
    return (
        <div className="hotel-details-map">
            {data?.position && (
                <MapContainer center={data?.position} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={data?.position}>
                        <Popup>
                            <p className="hotel-name">{data?.hotelName}</p>
                            {data?.address}
                        </Popup>
                    </Marker>
                </MapContainer>
            )}
        </div>
    );
};

export default Map;