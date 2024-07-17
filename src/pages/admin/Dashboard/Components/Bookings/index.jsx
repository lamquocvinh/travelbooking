import React from 'react';
import "./Bookings.scss"
import { SolutionOutlined, } from '@ant-design/icons';
import { Card, Skeleton, Statistic } from 'antd';
import { useGetBookingQuery } from "../../../../../services/bookingAPI";

const Bookings = () => {
    const { data, isLoading } = useGetBookingQuery();

    return (
        <div className='bookings-stats'>
            {isLoading ?
                <Skeleton active />
                :
                <Card bordered={false} className='card'>
                    <Statistic
                        title="Bookings"
                        value={data?.data?.content?.length}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                        prefix={<SolutionOutlined />}
                    />
                </Card >
            }
        </div>
    )
};
export default Bookings;