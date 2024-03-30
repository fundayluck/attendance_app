import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MyLocation = ({ center, setCenter }) => {
    const map = useMapEvents({
        click: () => {
            map.locate()
        },
        locationfound: (location) => {
            setCenter({
                latitude: location.latlng.lat,
                longitude: location.latlng.lng,
                image: null,
            })
            map.flyTo(location.latlng, 15)
        },
    })
    return center === null ? null : (
        <Marker position={{ lat: center.latitude, lng: center.longitude }}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

const ToMap = ({ data, setData }) => {
    useEffect(() => {
        const L = require("leaflet");

        delete L.Icon.Default.prototype._getIconUrl;

        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
            iconUrl: require("leaflet/dist/images/marker-icon.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png")
        });
    }, []);

    return (
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
            <MyLocation center={data} setCenter={setData} />
        </MapContainer>
    )
}

export default ToMap