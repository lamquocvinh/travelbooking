import React, { useState, useEffect } from 'react';
import { useGetHotelWithPageQuery, usePostFilterHotelMutation, useSearchHotelsMutation } from '../../../services/hotelAPI';
import { Form, Link } from 'react-router-dom';
import './HotelList.scss';
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from 'react-redux';
import { setGuests, setRooms, setDate, setDestination } from '../../../slices/bookingSlice';
import { Col, Row, DatePicker, InputNumber, Checkbox, Select, Rate, Button, notification, Popover, Pagination, Spin, Radio } from "antd";
import { VietnameseProvinces } from "../../../utils/utils";
import HotelListContent from './component/HotelListContent';
import dayjs from 'dayjs';
import moment from 'moment';
const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';
const storageFormat = 'YYYY-MM-DD';
const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
};

const HotelList = () => {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const guests = useSelector(state => state.booking.guests);
    const rooms = useSelector(state => state.booking.rooms);
    const date = useSelector(state => state.booking.date);
    const destination = useSelector(state => state.booking.destination);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [filters, setFilters] = useState({});
    const [searches, setSearches] = useState({});
    const { data, isLoading } = useGetHotelWithPageQuery({ pageNumber: currentPage, pageSize });

    const [filterOptions, { isLoading: isFiltering }] = usePostFilterHotelMutation();
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState(null);


    const [searchHotels] = useSearchHotelsMutation();

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
        window.scrollTo({
            top: 100,
            left: 0,
            behavior: 'smooth'
        });
    };

    const handleFilter = async () => {
        const facilitiesMapping = {
            freeBreakfast: null,
            pickUpDropOff: null,
            restaurant: null,
            bar: null,
            pool: null,
            freeInternet: null,
            reception24h: null,
            laundry: null
        };

        selectedFacilities.forEach(facility => {
            facilitiesMapping[facility] = "true";
        });

        const body = {
            rating: selectedRatings,
            freeBreakfast: facilitiesMapping.freeBreakfast,
            pickUpDropOff: facilitiesMapping.pickUpDropOff,
            restaurant: facilitiesMapping.restaurant,
            bar: facilitiesMapping.bar,
            pool: facilitiesMapping.pool,
            freeInternet: facilitiesMapping.freeInternet,
            reception24h: facilitiesMapping.reception24h,
            laundry: facilitiesMapping.laundry,
            page: currentPage,
            size: pageSize
        };

        try {
            const response = await filterOptions(body).unwrap();
            console.log("Filtering with:", body, "Response:", response);
            setSearches();
            setFilters(response);
        } catch (error) {
            setFilters({ data: { content: [] } });
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleSearchChange = async () => {
        if (!destination || !guests || !rooms || !date || date.length !== 2) {
            console.log("Invalid search parameters");
            return;
        }

        const searchData = {
            province: destination,
            numPeople: guests,
            checkInDate: date[0],
            checkOutDate: date[1],
            numberOfRoom: rooms
        };
        try {
            const response = await searchHotels(searchData).unwrap();
            console.log("Search with:", searchData, "Response:", response);
            setFilters();
            setSearches(response);
        } catch (error) {
            console.log("Error:", error);
            setSearches({ data: { content: [] } });
        }
    };



    const handleRoomsChange = (value) => {
        dispatch(setRooms(value));
        if (guests > value * 6) {
            dispatch(setGuests(value * 6));
        }
    };

    const handleGuestsChange = (value) => {
        if (value > rooms * 6) {
            notification.warning({
                message: "Warning!",
                description: "Mỗi phòng tối đa 6 người."
            });
            dispatch(setGuests(rooms * 6));
        } else {
            dispatch(setGuests(value));
        }
    };

    const handleDateChange = (dates) => {
        if (dates) {
            const formattedDates = dates.map(date => date.format('YYYY-MM-DD')); // Format dates to 'YYYY-MM-DD'
            dispatch(setDate(formattedDates));
        } else {
            dispatch(setDate([]));
        }
    };

    const handleDestinationChange = (value) => {
        dispatch(setDestination(value));
    };



    const handleVisibleChange = (visible) => {
        setVisible(visible);
    };

    const defaultStartDate = dayjs().add(1, 'day');
    const defaultEndDate = dayjs().add(2, 'day');
    const defaultDates = [defaultStartDate, defaultEndDate];

    const dateObjects = date?.length ? date.map(dateString => dayjs(dateString, storageFormat)) : defaultDates;
    useEffect(() => {
        const defaultDates = [defaultStartDate?.format(storageFormat), defaultEndDate?.format(storageFormat)];
        dispatch(setDate(defaultDates));
    }, [dispatch]);

    const content = (
        <div>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <span>Guests</span>
                </Col>
                <Col span={12}>
                    <InputNumber min={1} value={guests} onChange={handleGuestsChange} />
                </Col>
                <Col span={12}>
                    <span>Rooms</span>
                </Col>
                <Col span={12}>
                    <InputNumber min={1} value={rooms} onChange={handleRoomsChange} />
                </Col>
            </Row>
        </div>
    );

    const handleFacilityChange = (checkedValues) => {
        setSelectedFacilities(checkedValues);
    };

    const handleRatingChange = (e) => {
        setSelectedRatings(e.target.value);
    };

    //Unrating
    const handleClearRating = () => {
        setSelectedRatings(null);
    };

    return (
        <div className='container-hotel-hotelSearch'>
            <Form className="search-layout-hotels">
                <div className='body'>
                    <RangePicker
                        className='item'
                        value={dateObjects?.length ? dateObjects?.map(date => dayjs(date, dateFormat)) : undefined}
                        onChange={handleDateChange}
                        disabledDate={disabledDate}
                        format={dateFormat}
                        placeholder={["Check In", "Check Out"]}
                    />

                    <Select
                        className='item'
                        value={destination}
                        onChange={handleDestinationChange}
                        showSearch
                        placeholder="Location"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        filterSort={(optionA, optionB) => optionA.children.localeCompare(optionB.children)}
                    >
                        {VietnameseProvinces.map((province, index) => (
                            <Select.Option key={index} value={province}>
                                {province}
                            </Select.Option>
                        ))}
                    </Select>

                    <Popover
                        content={content}
                        title="Select Guests and Rooms"
                        trigger="click"
                        open={visible}
                        onOpenChange={handleVisibleChange}
                    >
                        <Button className='item button-guest' >
                            {guests} Guests, {rooms} Room(s) <UserOutlined />
                        </Button>
                    </Popover>
                </div>

                <Button type="text" onClick={handleSearchChange} className="search-layout-hotels-btn">
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                        <p><SearchOutlined /></p>
                    </div>
                </Button>

            </Form>
            <div className="hotel">
                <Form className="filter">
                    <div className='facilities'>
                        Facilities
                        <Checkbox.Group className="facilities-check-box" onChange={handleFacilityChange}>
                            <div><Checkbox value="freeBreakfast">Free Breakfast</Checkbox></div>
                            <div><Checkbox value="pickUpDropOff">Pick Up Drop Off</Checkbox></div>
                            <div><Checkbox value="restaurant">Restaurant</Checkbox></div>
                            <div><Checkbox value="bar">Bar</Checkbox></div>
                            <div><Checkbox value="pool">Pool</Checkbox></div>
                            <div><Checkbox value="freeInternet">Free Internet</Checkbox></div>
                            <div><Checkbox value="reception24h">Reception 24h</Checkbox></div>
                            <div><Checkbox value="laundry">Laundry</Checkbox></div>
                        </Checkbox.Group>
                    </div>

                    <div className='facilities'>
                        Rating
                        <Radio.Group className="facilities-check-box" onChange={handleRatingChange} value={selectedRatings} defaultValue={null}>
                            <div><Radio value={1}><Rate value={1} disabled /></Radio></div>
                            <div><Radio value={2}><Rate value={2} disabled /></Radio></div>
                            <div><Radio value={3}><Rate value={3} disabled /></Radio></div>
                            <div><Radio value={4}><Rate value={4} disabled /></Radio></div>
                            <div><Radio value={5}><Rate value={5} disabled /></Radio></div>
                            <div><Radio value={null} onClick={handleClearRating}>Unrated</Radio></div>
                        </Radio.Group>
                    </div>

                    <Button className="btn" type="button" onClick={handleFilter}>
                        Search Room
                    </Button>

                </Form>
                <HotelListContent
                    data={data}
                    filters={filters}
                    isLoading={isLoading}
                    isFiltering={isFiltering}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    handlePageChange={handlePageChange}
                    searches={searches}
                />

            </div>
        </div>
    );
};

export default HotelList;
