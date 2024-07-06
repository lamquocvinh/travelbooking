import React, { useState } from 'react';
import './Package.scss';
import { useGetAllPackagesQuery, useRegisterPackageMutation } from '../../../services/packageAPI';
import { useGetPaymentUrlForPackageMutation } from "../../../services/paymentAPI";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { notification } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from "../../../slices/auth.slice";

const Packet = () => {
    //call api
    const { data } = useGetAllPackagesQuery();
    const [register] = useRegisterPackageMutation();
    const [payment] = useGetPaymentUrlForPackageMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [method, setMethod] = useState("");
    const [bank, setBank] = useState("");
    const [selectedPackageId, setSelectedPackageId] = useState(null); // New state for selected package ID
    const [selectedPackagePrice, setSelectedPackagePrice] = useState(0); // New state for selected package price

    //lấy data từ redux
    const phoneNumber = useSelector(state => state.auth.phoneNumber);
    const email = useSelector(state => state.auth.email);
    const fullName = useSelector(state => state.auth.fullName);

    // console.log(phoneNumber, email, fullName);
    // console.log(selectedPackageId, selectedPackagePrice, bank)

    const handleRegister = async () => {
        if (!selectedPackageId || !selectedPackagePrice) {
            notification.error({
                message: "Error",
                description: 'Please select a package first!',
            });
            return;
        }
        try {
            alert('Redirecting to VNPay...');
            const response = await register(selectedPackageId).unwrap();
            if (response) {
                notification.success({
                    message: "Success",
                    description: "Successfully registered the package!",
                });
                const payRes = await payment({
                    "packageId": selectedPackageId,
                    "total": selectedPackagePrice,
                    "bank": bank,
                    "phone": phoneNumber,
                    "fullName": fullName,
                    "email": email
                });
                console.log(payRes)
                if (payRes) {
                    const paymentUrl = payRes?.data?.data?.paymentUrl;


                    // Đợi một khoảng thời gian trước khi đăng xuất
                    setTimeout(() => {
                        // Hiện thông báo thành công

                        notification.success({
                            message: "Success",
                            description: "You will be redirected to the payment page. After completing the payment, you will be logged out.",
                        });
                        // Thực hiện đăng xuất
                        dispatch(logOut()); // Thay đổi theo logic của bạn
                        // Chuyển hướng đến trang đăng nhập
                        navigate('/login');
                    }, 2000); // Đợi 2 giây trước khi đăng xuất

                    // Chuyển hướng đến URL thanh toán
                    window.location.href = paymentUrl;
                } else {
                    throw new Error('Payment failed');
                }
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: 'Failed to register the package. Please try again!',
            });
        }
    };

    const handlePackageSelect = (packageId, packagePrice) => {
        setSelectedPackageId(packageId);
        setSelectedPackagePrice(packagePrice);
    };

    return (
        <div className="packet-page">
            <div className="banner-content">
                Save from 15% when paying annually.
            </div>
            <div className="packet-container">
                {data?.data?.map(pack => (
                    <div className="packet" key={pack.id}>
                        <h2>{`Package ${pack.name}`}</h2>
                        <div className="description">Unlock features to start trading.</div>
                        <div className="price">{`${pack.price.toLocaleString()} đ`}</div>
                        <div className="description">{`/${pack.duration === 1 ? 'month' : 'year'} for one partner`}</div>
                        <button onClick={() => handlePackageSelect(pack.id, pack.price)} className="btn">Choose package</button>
                    </div>
                ))}
            </div>
            <div className="select-pay-method">
                <div className="pay-methods">
                    <h2 className="title">How do you want to pay?</h2>
                    <div className="method-item" onClick={() => { setMethod("VNPay") }}>
                        <div className="name">
                            <input type="radio" checked={method === "VNPay"} onChange={() => { setMethod("VNPay") }} />
                            <span>VNPay</span>
                        </div>
                        <img
                            src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                            alt="VNPay"
                        />
                    </div>
                    {method === "VNPay" &&
                        <div>
                            <div className="sub-item" onClick={() => { setBank("NCB") }}>
                                <div className="name">
                                    <input type="radio" checked={bank === "NCB"} onChange={() => { setBank("NCB") }} />
                                    <img
                                        src="https://s-vnba-cdn.aicms.vn/vnba-media/23/8/22/ncb_64e48d66c2ccd.jpg"
                                        alt="NCB"
                                    />
                                    <span>NCB</span>
                                </div>
                            </div>
                            <div className="sub-item" onClick={() => { setBank("OtherBank") }}>
                                <div className="name">
                                    <input type="radio" checked={bank === "OtherBank"} onChange={() => { setBank("OtherBank") }} />
                                    <img
                                        src="https://stepup.edu.vn/wp-content/uploads/2020/08/the-other-1.jpg"
                                        alt="OtherBank"
                                    />
                                    <span>Other Bank</span>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="method-item" onClick={() => { setMethod("OtherPay") }}>
                        <div className="name">
                            <input type="radio" checked={method === "OtherPay"} onChange={() => { setMethod("OtherPay") }} />
                            <span>Other Payment</span>
                        </div>
                        <img
                            src="https://stepup.edu.vn/wp-content/uploads/2020/08/the-other-1.jpg"
                            alt="OtherPay"
                        />
                    </div>
                </div>
                <div className="pay-section">
                    <div className="confirm-price">
                        <span>Total price</span>
                        <span>{selectedPackagePrice.toLocaleString()} VND</span>
                    </div>
                    <button
                        className="pay-btn"
                        type="button"
                        onClick={handleRegister}
                        disabled={(method === "OtherPay" || bank === "" || bank === "OtherBank") ? true : false}
                    >
                        Pay
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Packet;
