import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Upload,
    Form,
    Input,
    Radio,
    DatePicker,
    Select,
    notification,
    message,
} from 'antd';
import { VietnameseProvinces } from '../../../../../utils/utils';
import { useGetUserDetailsQuery, useUpdateProfileMutation } from "../../../../../services/userAPI";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import dayjs from 'dayjs';


const { Option } = Select;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const Profile = () => {
    const [form] = Form.useForm();
    const dateFormat = 'DD/MM/YYYY';
    const id = useSelector(state => state.auth.userId);


    //call api
    const { data } = useGetUserDetailsQuery(id);
    const [updateProfile] = useUpdateProfileMutation();

    console.log(data);
    const getValueOrDefault = (value) => {
        return value !== null && value !== undefined ? value : 'null';
    };

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                full_name: (data.full_name),
                phone_number: (data.phone_number),
                email: (data.email),
                date_of_birth: data.date_of_birth ? dayjs(data.date_of_birth) : undefined,
                address: (data.address),
            });
        }
    }, [data, form]);

    const handleSubmit = (values) => {
        const formattedValues = {
            ...values,
            date_of_birth: values?.date_of_birth ? values?.date_of_birth.format('YYYY-MM-DD') : null,
        };
        console.log(formattedValues);
        try {
            updateProfile(formattedValues);
            notification.success({
                message: "Success",
                description: "Profile update successfully!",
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message,
            });
        }

    };

    return (
        <>
            <h1 style={{ margin: 50, marginTop: 10 }}>Edit Profile</h1>
            <Form
                size='large'
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={handleSubmit}
            >

                <Form.Item style={{ fontSize: '18px' }} size='large' label="Gender" name="gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
                    <Radio.Group>
                        <Radio value="female">Female</Radio>
                        <Radio value="male">Male</Radio>
                        <Radio value="other">Other</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item size='large' label="Name" name="full_name" rules={[{ required: true, message: 'Please enter your name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item size='large' label="Phone" name="phone_number" rules={[{ required: true, message: 'Please enter your phone number!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item size='large' label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Date of Birth"
                    name="date_of_birth"
                    rules={[
                        { required: true, message: "Please select user date of birth!" },
                        () => ({
                            validator(_, value) {

                                const selectedYear = value && value.year();
                                const currentYear = new Date().getFullYear();
                                if (selectedYear && currentYear && currentYear - selectedYear >= 18 && currentYear - selectedYear <= 100) {
                                    return Promise.resolve();
                                } else {
                                    form.resetFields(['date_of_birth']);
                                    if ((currentYear - selectedYear < 18)) {
                                        message.error("must greater than 18 years old !!!")
                                    }
                                    return Promise.reject(new Error("Invalid date of birth!"));
                                }
                            },
                        }),
                    ]}>
                    <DatePicker />
                </Form.Item>

                <Form.Item size='large' label="Address" name="address" rules={[{ required: true, message: 'Please enter your address!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item size='large' wrapperCol={{ offset: 6, span: 16 }}>
                    <Button style={{ marginLeft: "-50px" }} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default Profile;
