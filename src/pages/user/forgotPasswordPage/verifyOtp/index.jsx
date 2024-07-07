import "./VerifyOtp.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetOtpMutation, useVerifyOtpMutation } from "../../../../services/authAPI";
import { useEffect } from "react";
import { notification, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../slices/auth.slice"; // Adjust the import according to your project structure
import IMG from "../../../../assets/photo-3-1485152074061.jpg";

const schema = yup
    .object({
        otp: yup.string().required("This is required field.").trim(),
    })
    .required();

function VerifyOtpPage() {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
    const [getOtp] = useGetOtpMutation();

    useEffect(() => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (token) {
            dispatch(setToken(token));
            navigate('/');
        }
    }, [navigate, dispatch]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (dataObj) => {
        try {
            const result = await verifyOtp({
                email: params.email,
                body: {
                    "otp": dataObj.otp
                }
            }).unwrap();
            if (result.status == "OK") {
                navigate(`/forgot-password-change-password/${params?.email}`);
                notification.success({
                    message: "Verify OTP successfully",
                });
            } else {
                reset();
                notification.error({
                    message: "Verify OTP error",
                });
            }
        } catch (error) {
            reset();
            notification.error({
                message: "Verify OTP error",
            });
        }
    };

    const resendOtp = async () => {
        try {
            const result = await getOtp(params.email).unwrap();
            if (result?.status == "OK") {
                sessionStorage.setItem("forgotPassword", "true");
                notification.success({
                    message: "Resend OTP successfully",
                });
            } else {
                reset();
                notification.error({
                    message: "Resend OTP error",
                });
            }
        } catch (error) {
            reset();
            notification.error({
                message: "Resend OTP error",
            });
        }
    }

    useEffect(() => {
        if (sessionStorage.getItem("forgotPassword") != "true") {
            navigate("/")
        }
    })

    return (
        <div className="wrapper-verify-otp">
            <img className="image" src={IMG} alt="Image" />
            <div className="container">
                <Spin spinning={isLoading}>
                    <form
                        className="form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <h1 className="title">Verify OTP</h1>

                        <div className="body">
                            <div className="item">
                                <p className="label">OTP</p>
                                <input
                                    {...register("otp")}
                                    className="input"
                                    placeholder="Enter OTP"
                                    type="number"
                                />
                                <p className="error">{errors.otp?.message}</p>
                            </div>
                            <a className="forgot" onClick={resendOtp}>Resend OTP</a>
                        </div>
                        <button className="btn">
                            Verify OTP
                        </button>
                    </form>
                </Spin>
            </div>
        </div>
    );
}

export default VerifyOtpPage;
