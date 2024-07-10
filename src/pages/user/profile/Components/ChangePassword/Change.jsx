import { Form, Input, Button, notification } from 'antd';
import React from 'react';
import './Change.scss';
import { useUpdatePasswordsMutation } from "../../../../../services/userAPI";
import { useSelector } from 'react-redux';
const Change = () => {
    const [form] = Form.useForm();

    const id = useSelector(state => state.auth.userId);
    //call api
    const [updatePass] = useUpdatePasswordsMutation();

    const handleSubmit = (values) => {
        console.log('pass:', values);

        try {
            updatePass({ id: id, body: values });
            notification.success({
                message: "Success",
                description: "Chage password successfully!",
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message,
            });
        }
    };

    return (
        <div className="form-container">
            <h1 style={{ marginLeft: "20px" }} className="form-title">Change Password</h1>
            <Form
                size='large'
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 900 }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    className='form-item'
                    size='large'
                    label="Current Password"
                    name="old_password"
                    rules={[
                        { required: true, message: 'Please enter your current password!' },
                        { pattern: /^.{6,24}$/, message: 'Password must be between 6 and 24 characters!' }
                    ]}
                >
                    <Input.Password className='input' />
                </Form.Item>
                <Form.Item
                    className='form-item'
                    size='large'
                    label="New Password"
                    name="new_password"
                    rules={[
                        { required: true, message: 'Please enter your new password!' },
                        { pattern: /^.{6,24}$/, message: 'Password must be between 6 and 24 characters!' }
                    ]}
                >
                    <Input.Password className='input' />
                </Form.Item>
                <Form.Item
                    className='form-item'
                    size='large'
                    label="Confirm Password"
                    name="confirm_password"
                    rules={[
                        { required: true, message: 'Please enter your confirm password!' },
                        { pattern: /^.{6,24}$/, message: 'Password must be between 6 and 24 characters!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('New Password does not match the Confirm Password.!');
                            },
                        }),
                    ]}
                >
                    <Input.Password className='input' />
                </Form.Item>

                <Form.Item size='large' wrapperCol={{ offset: 6, span: 16 }}>
                    <Button style={{ marginLeft: "-75px" }} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Change;
