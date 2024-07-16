import React from 'react';
import "./Hotels.scss"
import { HomeOutlined } from '@ant-design/icons';
import { Card, Skeleton, Statistic } from 'antd';
import { useGetHotelForAdminQuery } from "../../../../../services/hotelAPI";

const Hotels = () => {
    const { data, isLoading } = useGetHotelForAdminQuery();

    return (
        <div className='users-stats'>
            {isLoading ?
                <Skeleton active />
                :
                <Card bordered={false} className='card'>
                    <Statistic
                        title="Hotels"
                        value={data?.data?.content?.length}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                        prefix={<HomeOutlined />}
                    />
                </Card >
            }
        </div>
    )
};
export default Hotels;