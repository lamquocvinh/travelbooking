import React from 'react';
import "./Partners.scss"
import { TeamOutlined } from '@ant-design/icons';
import { Card, Skeleton, Statistic } from 'antd';
import { useGetPartnersQuery } from "../../../../../services/userAPI";

const Partners = () => {
    const { data, isLoading } = useGetPartnersQuery();

    return (
        <div className='partners-stats'>
            {isLoading ?
                <Skeleton active />
                :
                <Card bordered={false} className='card'>
                    <Statistic
                        title="Partners"
                        value={data?.length}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                        prefix={<TeamOutlined />}
                    />
                </Card >
            }
        </div>
    )
};
export default Partners;