import React from 'react';
import "./Revenues.scss"
import { DollarOutlined, } from '@ant-design/icons';
import { Card, Skeleton, Statistic } from 'antd';
import { useGetTotalRevenueQuery } from "../../../../../services/dashboardAPI";

const Revenues = () => {
    const { data, isLoading } = useGetTotalRevenueQuery();

    return (
        <div className='revenues-stats'>
            {isLoading ?
                <Skeleton active />
                :
                <Card bordered={false} className='card'>
                    <Statistic
                        title="Revenues"
                        value={data || 0}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                        prefix={<DollarOutlined />}
                        suffix={"VND"}
                    />
                </Card >
            }
        </div>
    )
};
export default Revenues;