import React from 'react';
import "./Users.scss"
import { UserOutlined } from '@ant-design/icons';
import { Card, Skeleton, Statistic } from 'antd';
import { useGetUsersQuery } from "../../../../../services/userAPI";

const Users = () => {
    const { data, isLoading } = useGetUsersQuery();

    return (
        <div className='users-stats'>
            {isLoading ?
                <Skeleton active />
                :
                <Card bordered={false} className='card'>
                    <Statistic
                        title="Users"
                        value={data?.length}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                        prefix={<UserOutlined />}
                    />
                </Card >
            }
        </div>
    )
};
export default Users;