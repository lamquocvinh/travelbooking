// HotelListItems.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Spin, Rate, Pagination } from 'antd';
import "./HotelListConent.scss"
const HotelListItems = ({ data, filters, isLoading, isFiltering, currentPage, pageSize, handlePageChange }) => {
    return (
        <div className="list-hotel">
            <Spin spinning={isLoading || isFiltering}>
                {filters?.data?.content && filters?.data?.content?.length === 0 ? (
                    <p className="no-data">No hotel available</p>
                ) : filters?.data?.content?.length > 0 ? (
                    filters?.data?.content?.map((hotel) => (
                        <div key={hotel?.id} className="hotel-item">
                            {hotel?.discount && <div className="hotel-discount">{hotel?.discount}</div>}
                            <img
                                src={hotel?.image_urls?.[0]?.url || 'default_image_url.jpg'}
                                alt={hotel?.hotel_name || 'Default Hotel Name'}
                                className="hotel-img"
                            />
                            <div className="hotel-info">
                                <div className='body-start'>
                                    <h2 className="hotel-name">{hotel?.hotel_name}</h2>
                                    <div className="hotel-rating">
                                        <Rate allowHalf value={hotel?.rating} disabled />
                                    </div>
                                    <div className='hotel-conveniences'>
                                        {hotel?.conveniences && hotel?.conveniences.length > 0 ? (
                                            hotel?.conveniences.map((convenience, index) => {
                                                const trueConveniences = [];
                                                if (convenience.bar) trueConveniences.push("Bar");
                                                if (convenience.free_breakfast) trueConveniences.push("Breakfast");
                                                if (convenience.free_internet) trueConveniences.push("Internet");
                                                if (convenience.laundry) trueConveniences.push("Laundry");
                                                if (convenience.pick_up_drop_off) trueConveniences.push("Pick-Up/Drop-Off");
                                                if (convenience.pool) trueConveniences.push("Pool");
                                                if (convenience.reception_24h) trueConveniences.push("24h Reception");
                                                if (convenience.restaurant) trueConveniences.push("Restaurant");
                                                return (
                                                    <React.Fragment key={index}>
                                                        {trueConveniences.map((item, idx) => (
                                                            <span key={`${index}-${idx}`} className="convenience-item">
                                                                {item}{idx < trueConveniences.length - 1 ? ', ' : ''}
                                                            </span>
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            })
                                        ) : (
                                            <p className="no-conveniences">No conveniences available</p>
                                        )}
                                    </div>
                                </div>
                                <div className='body-end'>
                                    <div className="infomation">
                                        Click on details to see more information.
                                    </div>
                                    <Link className="hotel-book-now" to={`/hotel-detail/${hotel?.id}`}>
                                        DETAIL
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : data?.data?.content?.length > 0 ? (
                    data?.data?.content?.map((hotel) => (
                        <div key={hotel?.id} className="hotel-item">
                            {hotel?.discount && <div className="hotel-discount">{hotel?.discount}</div>}
                            <img
                                src={hotel?.image_urls?.[0]?.url || 'default_image_url.jpg'}
                                alt={hotel?.hotel_name || 'Default Hotel Name'}
                                className="hotel-img"
                            />
                            <div className="hotel-info">
                                <div className='body-start'>
                                    <h2 className="hotel-name">{hotel?.hotel_name}</h2>
                                    <div className="hotel-rating">
                                        <Rate allowHalf value={hotel?.rating} disabled />
                                    </div>
                                    <div className='hotel-conveniences'>
                                        {hotel?.conveniences && hotel?.conveniences.length > 0 ? (
                                            hotel?.conveniences.map((convenience, index) => {
                                                const trueConveniences = [];
                                                if (convenience.bar) trueConveniences.push("Bar");
                                                if (convenience.free_breakfast) trueConveniences.push("Breakfast");
                                                if (convenience.free_internet) trueConveniences.push("Internet");
                                                if (convenience.laundry) trueConveniences.push("Laundry");
                                                if (convenience.pick_up_drop_off) trueConveniences.push("Pick-Up/Drop-Off");
                                                if (convenience.pool) trueConveniences.push("Pool");
                                                if (convenience.reception_24h) trueConveniences.push("24h Reception");
                                                if (convenience.restaurant) trueConveniences.push("Restaurant");
                                                return (
                                                    <React.Fragment key={index}>
                                                        {trueConveniences.map((item, idx) => (
                                                            <span key={`${index}-${idx}`} className="convenience-item">
                                                                {item}{idx < trueConveniences.length - 1 ? ', ' : ''}
                                                            </span>
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            })
                                        ) : (
                                            <p className="no-conveniences">No conveniences available</p>
                                        )}
                                    </div>
                                </div>
                                <div className='body-end'>
                                    <div className="infomation">
                                        Click on details to see more information.
                                    </div>
                                    <Link className="hotel-book-now" to={`/hotel-detail/${hotel?.id}`}>
                                        DETAIL
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))

                ) : (
                    <p className="no-data">No hotel1 available</p>
                )}
                <Pagination
                    className='pagination-container'
                    current={currentPage + 1}
                    total={filters?.data?.totalElements}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showTotal={(total) => `Total ${total} items`}
                />
            </Spin>
        </div>
    );
};

export default HotelListItems;
