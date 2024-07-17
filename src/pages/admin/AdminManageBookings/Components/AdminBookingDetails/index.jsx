import "./AdminBookingDetails.scss";
import { useGetBookingDetailsQuery } from '../../../../../services/bookingAPI';
import { useParams } from "react-router-dom";
import { Spin, Tag } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    LoginOutlined,
    LogoutOutlined,
} from '@ant-design/icons';

function AdminBookingDetails() {
    const params = useParams();
    const { data, isLoading } = useGetBookingDetailsQuery(params.bookingId);

    return (
        <div className="admin-booking-details-wrapper">
            <Spin spinning={isLoading}>
                <div className="card">
                    <div className="booking-info">
                        <h2 className="item">Booking Details</h2>
                        <div className="item">
                            {data?.data?.status === "PENDING" &&
                                <Tag icon={<SyncOutlined spin />} color="processing">
                                    PENDING
                                </Tag>
                            }
                            {data?.data?.status === "CONFIRMED" &&
                                <Tag icon={<CheckCircleOutlined />} color="warning">
                                    CONFIRMED
                                </Tag>
                            }
                            {data?.data?.status === "PAID" &&
                                <Tag icon={<CheckCircleOutlined />} color="success">
                                    PAID
                                </Tag>
                            }
                            {data?.data?.status === "CANCELLED" &&
                                <Tag icon={<CloseCircleOutlined />} color="error">
                                    CANCELLED
                                </Tag>
                            }
                            {data?.data.status === "CHECKED_IN" &&
                                <Tag icon={<LoginOutlined />} color="blue">
                                    CHECKED IN
                                </Tag>
                            }
                            {data?.data.status === "CHECKED_OUT" &&
                                <Tag icon={<LogoutOutlined />} color="blue">
                                    CHECKED OUT
                                </Tag>
                            }
                        </div>
                        <button className="item cancel" type="reset" onClick={() => {
                            window.history.back();
                        }}>
                            <CloseCircleOutlined />
                        </button>
                    </div>
                    <div className="details">
                        <div className="item-25">
                            <label>Booking ID</label>
                            <p className="input">{data?.data["booking-id"]}</p>
                        </div>
                        <div className="item-25">
                            <label>Booking date</label>
                            <p className="input">{data?.data["booking-date"][2]}/{data?.data["booking-date"][1]}/{data?.data["booking-date"][0]}</p>
                        </div>
                        <div className="item-25">
                            <label>Booking time</label>
                            <p className="input">{data?.data["booking-date"][3]}:{data?.data["booking-date"][4]}:{data?.data["booking-date"][5]}</p>
                        </div>
                        <div className="item-25">
                            <label>Payment method</label>
                            <p className="input">{data?.data["payment-method"]}</p>
                        </div>
                        <div className="item-50">
                            <label>Hotel name</label>
                            <p className="input">{data?.data["hotel-name"]}</p>
                        </div>
                        <div className="item-25">
                            <label>Check in</label>
                            <p className="input">{data?.data["check-in-date"][2]}/{data?.data["check-in-date"][1]}/{data?.data["check-in-date"][0]}</p>
                        </div>
                        <div className="item-25">
                            <label>Check out</label>
                            <p className="input">{data?.data["check-out-date"][2]}/{data?.data["check-out-date"][1]}/{data?.data["check-out-date"][0]}</p>
                        </div>
                        <div className="item-25">
                            <label>Room name</label>
                            <p className="input">{data?.data["booking-details"][0]["room-name"]}</p>
                        </div>
                        <div className="item-25">
                            <label>Quantity</label>
                            <p className="input">{data?.data["booking-details"][0]["number-of-rooms"]}</p>
                        </div>
                        <div className="item-25">
                            <label>Price</label>
                            <p className="input">{data?.data["booking-details"][0]["price"].toLocaleString()} VND</p>
                        </div>
                        <div className="item-25">
                            <label>Total price</label>
                            <p className="input">{data?.data["total-price"].toLocaleString()} VND</p>
                        </div>
                        <div className="item-100">
                            <label>Note</label>
                            <p className="input">{data?.data?.note}</p>
                        </div>
                    </div>
                    <div className="guest-info">
                        <h2>Guest Info</h2>
                    </div>
                    <div className="details">
                        <div className="item-50">
                            <label>Fullname</label>
                            <p className="input">{data?.data["full-name"]}</p>
                        </div>
                        <div className="item-25">
                            <label>Email</label>
                            <p className="input">{data?.data["email"]}</p>
                        </div>
                        <div className="item-25">
                            <label>Phone</label>
                            <p className="input">{data?.data["phone-number"]}</p>
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    );
}

export default AdminBookingDetails;