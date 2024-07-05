import React from 'react';
import './Packet.scss';
import { useGetPacketQuery } from '../../../services/packetAPI';
const Packet = () => {
    const { data } = useGetPacketQuery();
    return (
        <div className="packet-page">
            <div className="banner-content">
                Save from 15% when paying annually.
            </div>
            <div className="packet-container">
                {data?.data?.map(pack => (
                    <div className="packet" key={pack.id}>
                        <h2>{`Packet ${pack.name}`}</h2>
                        <div className="description">Unlock features to start trading.</div>
                        <div className="price">{`${pack.price.toLocaleString()} đ`}</div>
                        <div className="description">{`/${pack.duration === 1 ? 'month' : 'year'} for one partner`}</div>
                        <a href="#" className="btn">Join with us</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Packet;
