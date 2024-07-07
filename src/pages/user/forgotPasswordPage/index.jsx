import "./ForgotPasswordPage.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetOtpMutation } from "../../../services/authAPI";
import { useEffect } from "react";
import { notification, Spin } from "antd";
import { useNavigate, } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../../../slices/auth.slice"; // Adjust the import according to your project structure
import IMG from "../../../assets/photo-3-1485152074061.jpg";

const schema = yup
    .object({
        email: yup.string().required("This is required field.").trim().email(),
    })
    .required();

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [getOtp, { isLoading }] = useGetOtpMutation();

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
            const result = await getOtp(dataObj.email).unwrap();
            if (result?.status == "OK") {
                sessionStorage.setItem("forgotPassword", "true");
                navigate(`/verify-otp/${dataObj.email}`);
                notification.success({
                    message: "Get OTP successfully",
                });
            } else {
                reset();
                notification.error({
                    message: "Get OTP error",
                });
            }
        } catch (error) {
            reset();
            notification.error({
                message: "Get OTP error",
            });
        }
    };

    return (
        <div className="wrapper-forgot-password">
            <img className="image" src={IMG} alt="Image" />
            <div className="container">
                <Spin spinning={isLoading}>
                    <form
                        className="form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <h1 className="title">Forgot Password</h1>

                        <div className="body">
                            {/* Email */}
                            <div className="item">
                                <p className="label">Email</p>
                                <input
                                    {...register("email")}
                                    className="input"
                                    placeholder="Enter email to get OTP"
                                />
                                <p className="error">{errors.email?.message}</p>
                            </div>
                        </div>
                        <button className="btn">
                            Get OTP
                        </button>
                    </form>
                </Spin>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
