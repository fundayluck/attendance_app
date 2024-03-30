import ReactDOM from 'react-dom'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MyLocation = ({ center, setCenter }) => {
    const map = useMapEvents({
        click: () => {
            map.locate()
        },

    })
    return center === null ? null : (
        <Marker position={{
            lat: center.latitude, lng: center.longitude
        }}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

const MapAttendance = ({ data, closeModal }) => {
    const [center, setCenter] = useState({
        latitude: data.latitude,
        longitude: data.longitude,
        image: null,
    })

    useEffect(() => {
        const L = require("leaflet");

        delete L.Icon.Default.prototype._getIconUrl;

        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
            iconUrl: require("leaflet/dist/images/marker-icon.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png")
        });
    }, []);
    return ReactDOM.createPortal(
        <div className='flex justify-center' >
            <div className="fixed inset-0 bg-gray-300 opacity-80" onClick={() => closeModal(false)}></div>
            <div className='fixed inset-40 top-10 p-2'>
                <div className='flex justify-center items-center'>
                    <MapContainer
                        zoom={5}
                        center={[-1.0933299, 113.2829777]}
                        scrollWheelZoom={true}
                        style={{ width: '140vh', height: '500px', borderRadius: 10 }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MyLocation center={center} setCenter={setCenter} />
                    </MapContainer>
                </div>
            </div>
        </div>,
        document.querySelector('.modal-container')
    )
}

export default MapAttendance