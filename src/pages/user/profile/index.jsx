import "./DashBoard.scss";
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import {
    SolutionOutlined,
    EditOutlined,
    PoweroffOutlined,
} from '@ant-design/icons';
import { Layout, Menu, notification } from 'antd';
import { TbPasswordUser } from "react-icons/tb";
import { Content } from "antd/es/layout/layout";
import { useDispatch } from "react-redux";
import { logOut } from "../../../slices/auth.slice";

const { Sider } = Layout;
import { logOut } from "../../../slices/auth.slice";
import { useDispatch } from "react-redux";
import { PURGE } from 'redux-persist';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        dispatch(logOut());
        notification.success({
            message: "Logout successfully",
            description: "See you again!",
        });
        setIsModalOpen(false);
        dispatch(logOut());
     
        navigate("/login");
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(location.pathname);

    useEffect(() => {
        setSelectedKey(location.pathname);
    }, [location.pathname]);

    return (
        <div className='dashboard'>
            <h3 className="dashboard-title">
                Dashboard
            </h3>
            <Layout className="dashboard-content">
                <Sider className="dashboard-content-sider" theme="light" width={240}>
                    <Menu className="dashboard-content-sider-menu" theme="light" selectedKeys={[selectedKey]} mode="inline" >
                        <Menu.Item className="dashboard-content-sider-menu-item" key="/user/booking" icon={<SolutionOutlined style={{ fontSize: '16px' }} />}>
                            <Link to="/user/booking">My Booking</Link>
                        </Menu.Item>
                        <Menu.Item className="dashboard-content-sider-menu-item" key="/user/profile" icon={<EditOutlined style={{ fontSize: '16px' }} />}>
                            <Link to="/user/profile">Edit Profile</Link>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item className="dashboard-content-sider-menu-item" key="/user/change-password" icon={<TbPasswordUser style={{ fontSize: '16px' }} />}>
                            <Link to="/user/change-password">Change Password</Link>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item className="dashboard-content-sider-menu-item" key="/user/logout" icon={<PoweroffOutlined style={{ fontSize: '16px' }} />}>
                            <a onClick={showModal}>Log Out</a>
                        </Menu.Item>
                    </Menu>
                    <Modal
                        title="Logging Out"
                        centered
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        width={400}
                    >
                        <p>Oh, no! You’ll miss a lot of things by logging out:<br /> Refund Booking and other member-only benefits.<br /><br /> Are you sure want to log out?</p>
                    </Modal>
                </Sider>
                <Content className="dashboard-content-main">
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </div>
    )
}

export default Profile