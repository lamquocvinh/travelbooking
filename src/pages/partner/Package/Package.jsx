import React, { useEffect, useState } from 'react';
import './Package.scss';
import { useGetAllPackagesQuery, useRegisterPackageMutation } from '../../../services/packageAPI';
import { useGetPaymentUrlForPackageMutation } from "../../../services/paymentAPI";
import { useCheckExpirationQuery, useGetPackageDetailsQuery } from '../../../services/packageAPI';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    CloseCircleOutlined,
} from '@ant-design/icons';

import { notification, Spin } from "antd";
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
    const [isLoading, setIsLoading] = useState(true);

    //lấy data từ redux
    const phoneNumber = useSelector(state => state.auth.phoneNumber);
    const email = useSelector(state => state.auth.email);
    const fullName = useSelector(state => state.auth.fullName);
    const packageIdCheck = useSelector(state => state.auth.packageId);
    const packageStart = useSelector(state => state.auth.package_start_date);
    const packageEnd = useSelector(state => state.auth.package_end_date);
    const { data: check } = packageIdCheck ? useCheckExpirationQuery() : { data: null };
    const { data: dataDetails } = useGetPackageDetailsQuery(packageIdCheck);

    useEffect(() => {
        if (data && (!packageIdCheck || check)) {
            setIsLoading(false);
        }
    }, [data, check, packageIdCheck]);

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
                if (payRes) {
                    const paymentUrl = payRes?.data?.data?.paymentUrl;

                    setTimeout(() => {

                        notification.success({
                            message: "Success",
                            description: "You will be redirected to the payment page. After completing the payment, you will be logged out.",
                        });


                    }, 2000);

                    window.location.href = paymentUrl;
                    navigate('/login');
                    dispatch(logOut());

                } else {
                    notification.error({
                        message: "Error",
                        description: 'Payment failed. Please try again!',
                    });
                }
            } else {
                notification.error({
                    message: "Error",
                    description: 'Failed to register the package. Please try again!',
                });
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

    if (isLoading) {
        return <div style={{ "display": "flex", "justifyContent": "center", "alignItems": "center", "height": "50vh" }}><Spin></Spin>;</div>
    }


    if (check?.message === "Package is still valid") {
        return (
            <div className="card">
                <div className="package-info">
                    <h2 className="item">Purchased Package Details.</h2>
                </div>
                <div className="packet-page">
                    <div className="packet">
                        <h2>{`Package ${dataDetails?.data["name"]}`}</h2>
                        <div className="price">{`${dataDetails?.data["price"].toLocaleString()} VNĐ`}</div>
                        <div className="description">{`${dataDetails?.data["description"]}`}</div>
                        <div className="description">This package is valid for <strong>{dataDetails?.data["duration"].toLocaleString()}</strong> days </div>
                        <div className="description">Package start date: <strong>{packageStart[2]}/{packageStart[1]}/{packageStart[0]}</strong></div>
                        <div className="description">Package end date: <strong>{packageEnd[2]}/{packageEnd[1]}/{packageEnd[0]}</strong></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="packet-page">
            <h2>Package List</h2>
            <div className="banner-content">
                Save from 15% when paying annually.
            </div>
            <div className="packet-container">
                {data?.data?.map(pack => (
                    <div className="packet" key={pack.id}>
                        <h2>{`Package ${pack.name}`}</h2>
                        <div className="description">Unlock features to start trading.</div>
                        <div className="price">{`${pack.price.toLocaleString()} đ`}</div>
                        <div className="description">{`${pack.description}`}</div>
                        <div className="description">This package is valid for <strong>{pack.duration}</strong> days </div>
                        <button onClick={() => handlePackageSelect(pack.id, pack.price)} className="btn">Choose package</button>
                    </div>
                ))}
            </div>
            <div style={{ color: "red", textAlign: "center", margin: "20px 0" }}>You must purchase a package to use partner's services</div>
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
