import { useEffect } from "react";
import "./RoomDetailsPage.scss";
import { FloatButton, Spin, Result } from "antd";
import BookingForm from "./Components/BookingForm";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetRoomDetailQuery } from "../../../services/roomAPI";
import Carousel from "./Components/Carousel";
import { icons } from '../../../utils/icons';

function RoomDetailsPage() {
    const params = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useGetRoomDetailQuery(params.roomId);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, []);

    return (
        <div className="wrapper-room-detail-page">
            {data?.data ?
                <Spin spinning={isLoading}>
                    <div className="container">
                        <div className="heading">
                            <h1 className="name">{data?.data?.room_type_name}</h1>
                        </div>
                        <div className="overview">
                            <span className="item">Max: {data?.data?.capacity_per_room} Guests</span>
                            {Object.entries(data?.data?.types?.[0] || {})
                                .filter(([key, value]) => (key !== "id" && value !== false))
                                .map(([key, value]) => (
                                    <span key={key} className='item'>
                                        {key.toUpperCase().slice(0, 1).concat(key.slice(1, key.length))}
                                    </span>
                                ))}
                        </div>
                        <Carousel images={data?.data?.image_urls} />
                        <div className="info">
                            <div className="details">
                                <div className="price">
                                    <h3 className="from">From {data?.data?.room_price?.toLocaleString()} VND</h3>
                                    <span className="per">per night</span>
                                </div>
                                <div className="description">
                                    {data?.data?.description}
                                </div>
                                <div className="amenities">
                                    <div className="section">
                                        <h3 className="title">Room Amenities</h3>
                                        <div className="list">
                                            {Object.entries(data?.data?.conveniences?.[0] || {})
                                                .filter(([key, value]) => (key !== "id" && value !== false))
                                                .map(([key, value]) => (
                                                    <span key={key} className='item'>
                                                        {icons[key]()}
                                                        {key.toUpperCase().slice(0, 1).concat(key.slice(1, key.length))}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="booking">
                                <BookingForm data={data?.data} />
                            </div>
                        </div>
                        <div className="more-rooms">
                            <h3 className="title">Don't feel satisfied!</h3>
                            <p className="description">There are still many other options waiting for you. There are countless other hotels and accommodations available.</p>
                            <button className="see-more" onClick={() => { navigate(-1) }}>Let's see more rooms.</button>
                        </div>
                    </div>
                </Spin>
                :
                <Spin spinning={isLoading}>
                    {isLoading ||
                        <Result
                            status="404"
                            title="404"
                            subTitle="Sorry, the page you visited does not exist."
                            extra={<Link to={"/"} className="back-home">Back Home</Link>}
                        />}
                </Spin>

            }
            <FloatButton.BackTop visibilityHeight={800} />
        </div >
    );
}

export default RoomDetailsPage;