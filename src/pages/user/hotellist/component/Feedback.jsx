import React, { useState, useEffect } from 'react';
import { Card, Rate, Button, Input, Form, notification, Progress } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Feedback.scss';
import { useCreateFeedbackMutation, useGetFeedbackQuery } from '../../../../services/hotelAPI';
import { useParams } from 'react-router-dom';

const { TextArea } = Input;

const ReviewPage = ({ dataName }) => {
    const { hotelId } = useParams();
    const [form] = Form.useForm();
    const [feedback] = useCreateFeedbackMutation();
    const { data, refetch } = useGetFeedbackQuery(hotelId);
    const [ratingStats, setRatingStats] = useState({});
    console.log(data)
    useEffect(() => {
        if (data?.data?.content) {
            const totalReviews = data.data.totalElements;
            const ratingCounts = {
                terrible: 0,
                poor: 0,
                okay: 0,
                good: 0,
                excellent: 0,
            };

            data.data.content.forEach((review) => {
                const { rating } = review;
                if (rating >= 0 && rating <= 2) {
                    ratingCounts.terrible++;
                } else if (rating > 2 && rating <= 4) {
                    ratingCounts.poor++;
                } else if (rating > 4 && rating <= 6) {
                    ratingCounts.okay++;
                } else if (rating > 6 && rating <= 8) {
                    ratingCounts.good++;
                } else if (rating > 8 && rating <= 10) {
                    ratingCounts.excellent++;
                }
            });

            const total = totalReviews > 0 ? totalReviews : 1; // Ensure no division by zero
            const terriblePercent = (ratingCounts.terrible / total) * 100;
            const poorPercent = (ratingCounts.poor / total) * 100;
            const okayPercent = (ratingCounts.okay / total) * 100;
            const goodPercent = (ratingCounts.good / total) * 100;
            const excellentPercent = (ratingCounts.excellent / total) * 100;

            setRatingStats({
                terrible: terriblePercent,
                poor: poorPercent,
                okay: okayPercent,
                good: goodPercent,
                excellent: excellentPercent,
            });
        }
    }, [data]);

    const handleFinish = async (values) => {
        const adjustedValues = {
            ...values,
            rating: values.rating * 2,
            hotelId: parseInt(hotelId),
        };
        try {
            await feedback(adjustedValues).unwrap();
            notification.success({
                message: 'Đánh giá của bạn đã được gửi',
                description: 'Cảm ơn bạn đã gửi phản hồi!',
            });
            refetch();
        } catch (error) {
            notification.error({
                message: 'Đánh giá của bạn xảy ra lỗi',
                description: 'Bạn chỉ được feedback sau khi check-out',
            });
        }
    };
    const totalReviews = data?.data?.totalElements;
    const averageRating = totalReviews > 0
        ? (data?.data?.content.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : 0;
    return (
        <div className="review-page">
            <Card className="dashboard-card" title={`Những review khác của du khách về ${dataName?.hotel_name}`}>
                <div className="dashboard-overview">
                    <div className="average-rating">
                        <Progress
                            type="circle"
                            percent={(averageRating / 10) * 100}
                            format={() => `${averageRating}`}
                            strokeColor="#5c98f2"
                        />
                        <div className="text">Tuyệt vời</div>
                    </div>
                    <div className="rating-breakdown">
                        {[
                            { label: 'Tuyệt vời', value: ratingStats.excellent },
                            { label: 'Rất tốt', value: ratingStats.good },
                            { label: 'Hài lòng', value: ratingStats.okay },
                            { label: 'Trung bình', value: ratingStats.poor },
                            { label: 'Kém', value: ratingStats.terrible },
                        ].map((item) => (
                            <div className="breakdown-item" key={item.label}>
                                <span>{item.label}</span>
                                <Progress
                                    percent={item.value}
                                    showInfo={false}
                                    strokeColor="#5c98f2"
                                    status="active"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
            <Card style={{ marginBottom: '20px' }} title="Đánh giá của bạn">
                <Form form={form} onFinish={handleFinish}>
                    <Form.Item
                        name="rating"
                        rules={[{ required: true, message: 'Vui lòng đánh giá' }]}
                    >
                        <Rate defaultValue={0} />
                    </Form.Item>
                    <Form.Item
                        name="comment"
                        rules={[{ required: true, message: 'Vui lòng nhập phản hồi của bạn' }]}
                    >
                        <TextArea rows={4} placeholder="Nhập phản hồi của bạn" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Gửi
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            {data?.data?.content.map((review, index) => (
                <Card key={index} className="review-card">
                    <div className="review-header">
                        <UserOutlined />
                        <span style={{ marginLeft: "8px", fontWeight: "bold" }} className="username">{review.username}</span>
                        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center" }} className="rating">
                            <Rate disabled value={review.rating / 2} />
                        </span>
                    </div>
                    <div style={{ marginTop: "10px" }} className="review-content">{review.comment}</div>
                </Card>
            ))}
        </div>
    );
};

export default ReviewPage;
