import "./Login.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    useFacebookLoginMutation,
    useGoogleLoginMutation,
    useLoginUserMutation,
} from "../../../services/authAPI";
import { useEffect } from "react";
import { notification, Space, Spin } from "antd";
import { FacebookOutlined, GoogleOutlined, SmileOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setInfo, setPackageEnd, setPackageId, setPackageStart } from "../../../slices/auth.slice"; // Adjust the import according to your project structure
import IMG from "../../../assets/photo-3-1485152074061.jpg";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";

const schema = yup
    .object({
        emailOrPhone: yup.string().required("This is required field.").trim(),
        password: yup.string().required("This is required field.").trim(),
    })
    .required();

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginUserMutation();
    const [googleLogin, { isLoading: isLoginGoogle }] = useGoogleLoginMutation();
    const [facebookLogin, { isLoading: isLoginFacebook }] = useFacebookLoginMutation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");
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

    const navigateByRoles = {
        'ROLE_ADMIN': '/admin',
        'ROLE_PARTNER': '/partner',
        'ROLE_CUSTOMER': '/',
    };

    //login with email and password
    const onSubmit = async (dataObj) => {
        try {
            const result = await login({
                login_identifier: dataObj.emailOrPhone,
                password: dataObj.password,
            }).unwrap();
            if (result) {
                dispatch(setInfo({
                    userId: result?.data?.id,
                    fullName: result?.data?.fullName,
                    email: result?.data?.email,
                    phoneNumber: result?.data?.phoneNumber,
                    role: result?.data?.roles?.[0],
                }));
                dispatch(setPackageId(result.data.package_id));
                dispatch(setPackageStart(result.data.package_start_date));
                dispatch(setPackageEnd(result.data.package_end_date));
                localStorage.setItem("token", result.data.token);

                const role = result?.data?.roles?.[0];
                const defaultPath = navigateByRoles[role] || "/";
                const from = defaultPath || location.state?.from?.pathname;
                const fromLink = sessionStorage.getItem("from")
                if (fromLink) {
                    sessionStorage.removeItem("from")
                    navigate(fromLink);
                } else {
                    navigate(from);
                }
                notification.success({
                    message: "Login successfully",
                    description:
                        <div>
                            Welcome {result?.data?.fullName} <SmileOutlined />
                        </div>,
                });
            } else {
                notification.error({
                    message: "Login error",
                    description: "Invalid email or password. Try again!",
                });
                reset(); // Clear input fields
            }
        } catch (error) {
            notification.error({
                message: "Login error",
                description: error.message,
            });
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                const result = await googleLogin(codeResponse.access_token).unwrap();
                console.log("Google login result:", result);
                if (result && result.token) {
                    handleLoginSuccess(result);
                } else {
                    console.error("Google login failed:", result);
                    notification.error({
                        message: "Login error",
                        description:
                            result?.message || "Google login failed. Please try again.",
                    }); pons
                }
            } catch (error) {
                console.error("Google login error:", error);
                notification.error({
                    message: "Login error",
                    description:
                        error.message ||
                        "An error occurred during Google login. Please try again.",
                });
            }
        },
    })

    const handleFacebookLogin = async (response) => {
        console.log("Raw Facebook rese:", response);
        try {
            if (!response.accessToken) {
                throw new Error("No access token provided by Facebook");
            }
            console.log(
                "Attempting to login with Facebook access token:",
                response.accessToken
            );
            const result = await facebookLogin(response.accessToken).unwrap();
            console.log("Facebook login result:", result);
            if (result) {
                handleLoginSuccess(result);
            } else {
                throw new Error("No result from facebookLogin");
            }
        } catch (error) {
            console.error("Facebook login error:", error);
            notification.error({
                message: "Login error",
                description: `Facebook login failed: ${error.message}. Please try again or contact support.`,
            });
        }
    };

    const handleLoginSuccess = (data) => {
        dispatch(setInfo({
            userId: data.id,
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            role: data.roles[0],
        })
        );
        dispatch(setPackageId(data.package_id));
        dispatch(setPackageStart(data.package_start_date));
        dispatch(setPackageEnd(data.package_end_date));
        localStorage.setItem("token", data.token);

        const role = data.roles[0];
        const defaultPath = navigateByRoles[role] || "/";
        const from = defaultPath || location.state?.from?.pathname;
        const fromLink = sessionStorage.getItem("from");
        if (fromLink) {
            sessionStorage.removeItem("from");
            navigate(fromLink);
        } else {
            navigate(from);
        }
        notification.success({
            message: "Login successful",
            description: (
                <div>
                    Welcome {data.fullName} <SmileOutlined />
                </div>
            ),
        });
    };

    return (
        <div className="wrapper-login">
            <img className="image" src={IMG} alt="Image" />
            <div className="container">
                <Spin spinning={isLoading || isLoginFacebook || isLoginGoogle}>
                    <form
                        className="form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <h1 className="title">Login</h1>
                        <div className="body">
                            {/* Email */}
                            <div className="item">
                                <p className="label">Email or Phone number</p>
                                <input
                                    {...register("emailOrPhone")}
                                    className="input"
                                    placeholder="Enter email or phone number"
                                />
                                <p className="error">{errors.emailOrPhone?.message}</p>
                            </div>
                            {/* Password */}
                            <div className="item">
                                <p className="label">Password</p>
                                <input
                                    {...register("password")}
                                    className="input"
                                    type="password"
                                    placeholder="Enter password"
                                />
                                <p className="error">{errors.password?.message}</p>
                            </div>
                            <Link className="forgot" to={"/forgot-password"}>Forgot password?</Link>
                        </div>
                        <button className="btn">
                            Login
                        </button>
                        <div style={{ marginTop: "1rem" }}>
                            <button type="button" className="google" onClick={() => loginWithGoogle()}>
                                <Space>
                                    <GoogleOutlined style={{ fontSize: "24px" }} />
                                    Login with Google
                                </Space>
                            </button>
                        </div>
                        <div style={{ marginTop: "1rem" }}>
                            <FacebookLogin
                                cssClass="facebook"
                                appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                                callback={handleFacebookLogin}
                                autoLoad={false}
                                fields="name,email,picture"
                                scope="public_profile,email"
                                icon={<FacebookOutlined style={{ marginRight: "8px", fontSize: "24px" }} />}
                                render={(renderProps) => (
                                    <button onClick={renderProps.onClick}>
                                        Login with Facebook
                                    </button>
                                )}
                            />
                        </div>
                    </form>
                    <div className="register-section">
                        <h3 className="login-content-ask">
                            Want to become a member?
                        </h3>
                        <p className="login-content-signup">
                            <Link to={`/register`}>Register now</Link>
                        </p>
                    </div>
                </Spin>
            </div >
        </div >
    );
}

export default LoginPage;
