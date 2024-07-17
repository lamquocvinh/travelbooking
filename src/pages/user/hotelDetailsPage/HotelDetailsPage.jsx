import "./HotelDetailsPage.scss";
import React, { useEffect, useRef, useState } from 'react';
import { FloatButton, Result, Spin } from 'antd';
import { Link, useParams } from 'react-router-dom';
import HeaderHotel from './component/jsx/HeaderHotel';
import Map from "./component/jsx/Map";
import HotelAbout from './component/jsx/HotelAbout';
import Amentites from './component/jsx/Amentites';
import Roomlist from './component/jsx/Roomlist';
import { useGetHotelDetailsForGuestQuery } from '../../../services/hotelAPI';
import { useGetRoomListForUserQuery } from '../../../services/roomAPI';
import FeedbackPage from "../hotellist/component/Feedback";
import { useSelector } from "react-redux";

const RoomlistDetail = () => {
    const { hotelId } = useParams('hotelId');
    const rooms = useSelector(state => state.booking.rooms);
    const { data, isLoading } = useGetHotelDetailsForGuestQuery(hotelId);
    const { data: RoomList } = useGetRoomListForUserQuery(hotelId);
    const [availableRoom, setAvailableRoom] = useState([]);

    // scroll to About page
    const hotelAboutRef = useRef(null);
    const scrollToHotelAbout = () => {
        hotelAboutRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    // scroll to Room page
    const roomRef = useRef(null);
    const scrollToRoom = () => {
        roomRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const HeaderParams = {
        hotel_name: data?.data?.hotel_name,
        brand: data?.data?.brand,
        rating: data?.data?.rating,
        address: data?.data?.location?.address,
    };

    const Feedback = {
        hotel_name: data?.data?.hotel_name,
    }

    const MapParams = {
        position: [
            data?.data?.location?.latitude,
            data?.data?.location?.longitude
        ],
        hotelName: data?.data?.hotel_name,
        address: data?.data?.location?.address,
    };

    const AboutParams = {
        description: data?.data?.description,
        images_urls: data?.data?.image_urls
    }

    const AmentitesParams = {
        conveniences: data?.data?.conveniences
    }

    useEffect(() => {
        const roomList = RoomList?.data?.content?.filter(room => room?.number_of_rooms == rooms);
        setAvailableRoom(roomList);
        sessionStorage.removeItem("paymentAccess")
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [RoomList]);

    return (
        <div className="hotel-details-page-wrapper">
            {data?.data ?
                <Spin spinning={isLoading}>
                    <HeaderHotel data={HeaderParams} toHotelAbout={scrollToHotelAbout} toRoom={scrollToRoom} />
                    <Map data={MapParams} />
                    <div ref={hotelAboutRef}>
                        <HotelAbout data={AboutParams} />
                    </div>
                    <Amentites data={AmentitesParams} />
                    <div ref={roomRef}>
                        <Roomlist roomTypes={availableRoom} hotel_name={data?.data?.hotel_name} hotel_Id={hotelId} />
                    </div>
                    <FeedbackPage dataName={Feedback}></FeedbackPage>
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
        </div>
    );
}

export default RoomlistDetail;
