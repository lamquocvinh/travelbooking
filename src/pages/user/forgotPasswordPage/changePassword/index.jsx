import "./ForgotChangePassword.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useChangePasswordByEmailMutation } from "../../../../services/authAPI";
import { useEffect } from "react";
import { notification, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../slices/auth.slice"; // Adjust the import according to your project structure
import IMG from "../../../../assets/photo-3-1485152074061.jpg";

const schema = yup
    .object({
        new_password: yup.string().required("This is required field.").trim().min(6, "Password must be at least 6 characters.").max(24, "Password must be at most 24 characters."),
        confirm_password: yup.string().required("This is required field.").trim().min(6, "Password must be at least 6 characters.").max(24, "Password must be at most 24 characters.")
    })
    .required();

function ForgotChangePassword() {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const [changePassword, { isLoading }] = useChangePasswordByEmailMutation();

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
            const result = await changePassword({
                email: params.email,
                body: {
                    "new_password": dataObj.new_password,
                    "confirm_password": dataObj.confirm_password
                }
            }).unwrap();
            if (result.status == "OK") {
                sessionStorage.removeItem("forgotPassword");
                navigate(`/login`);
                notification.success({
                    message: "Change password successfully",
                });
            } else {
                reset();
                notification.error({
                    message: "Change password error",
                });
            }
        } catch (error) {
            reset();
            notification.error({
                message: "Change password error",
            });
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("forgotPassword") != "true") {
            navigate("/")
        }
    })

    return (
        <div className="wrapper-forgot-change-password">
            <img className="image" src={IMG} alt="Image" />
            <div className="container">
                <Spin spinning={isLoading}>
                    <form
                        className="form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <h1 className="title">Change Password</h1>

                        <div className="body">
                            <div className="item">
                                <p className="label">New password</p>
                                <input
                                    {...register("new_password")}
                                    className="input"
                                    placeholder="Enter new password"
                                    type="password"
                                />
                                <p className="error">{errors.new_password?.message}</p>
                            </div>
                            <div className="item">
                                <p className="label">Comfirm password</p>
                                <input
                                    {...register("confirm_password")}
                                    className="input"
                                    placeholder="Retype password"
                                    type="password"
                                />
                                <p className="error">{errors.confirm_password?.message}</p>
                            </div>
                        </div>
                        <button className="btn">
                            Change password
                        </button>
                    </form>
                </Spin>
            </div>
        </div>
    );
}

export default ForgotChangePassword;
