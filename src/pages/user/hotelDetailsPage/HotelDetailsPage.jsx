import "./HotelDetailsPage.scss";
import React, { useEffect, useRef } from 'react';
import { FloatButton, Result, Spin } from 'antd';
import { Link, useParams } from 'react-router-dom';
import HeaderHotel from './component/jsx/HeaderHotel';
import HotelAbout from './component/jsx/HotelAbout';
import Amentites from './component/jsx/Amentites';
import Roomlist from './component/jsx/Roomlist';
import { useGetHotelDetailsForGuestQuery } from '../../../services/hotelAPI';
import { useGetRoomListForUserQuery } from '../../../services/roomAPI';

const RoomlistDetail = () => {
    const { hotelId } = useParams('hotelId');
    const { data, isLoading } = useGetHotelDetailsForGuestQuery(hotelId);
    const { data: RoomList } = useGetRoomListForUserQuery(hotelId);

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

    const AboutParams = {
        description: data?.data?.description,
        images_urls: data?.data?.image_urls
    }

    const AmentitesParams = {
        conveniences: data?.data?.conveniences
    }

    const RoomListParams = {
        roomTypes: RoomList?.data?.content
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, []);

    return (
        <div className="hotel-details-page-wrapper">
            {data?.data ?
                <Spin spinning={isLoading}>
                    <HeaderHotel data={HeaderParams} toHotelAbout={scrollToHotelAbout} toRoom={scrollToRoom} />
                    <div ref={hotelAboutRef}>
                        <HotelAbout data={AboutParams} />
                    </div>
                    <Amentites data={AmentitesParams} />
                    <div ref={roomRef}>
                        <Roomlist {...RoomListParams} hotel_name={data?.data?.hotel_name} hotel_Id={hotelId} />
                    </div>
                </Spin>
                :
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Link to={"/"} className="back-home">Back Home</Link>}
                />
            }
            <FloatButton.BackTop visibilityHeight={800} />
        </div>
    );
}

export default RoomlistDetail;
