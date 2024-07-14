import "./Login.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginUserMutation } from "../../../services/authAPI";
import { useEffect } from "react";
import { notification, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setInfo, setToken, setPackageId } from "../../../slices/auth.slice"; // Adjust the import according to your project structure
import IMG from "../../../assets/photo-3-1485152074061.jpg";
import { FacebookOutlined } from "@ant-design/icons";
import { FaGoogle } from 'react-icons/fa';
import GoogleLogin from "react-google-login";

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
    const loggingg = import.meta.env.VITE_LOGIN_GOOGLE;
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

    const navigateByRoles = {
        'ROLE_ADMIN': '/admin',
        'ROLE_PARTNER': '/partner',
        'ROLE_CUSTOMER': '/',
    };

    //login with facebook
    const handleFacebookLogin = () => {
        console.log('handleFacebookLogin');
    }

    //login with google
    const handleGoogleLogin = () => {
        console.log('handleGoogleLogin');
    }

    //login with email and password
    const onSubmit = async (dataObj) => {
        try {
            const result = await login({
                login_identifier: dataObj.emailOrPhone,
                password: dataObj.password,
            }).unwrap();
            if (result) {
                dispatch(setToken(result?.data?.token));
                dispatch(setInfo({
                    userId: result?.data?.id,
                    fullName: result?.data?.fullName,
                    email: result?.data?.email,
                    phoneNumber: result?.data?.phoneNumber,
                    role: result?.data?.roles?.[0],
                }));
                dispatch(setToken(result.data.token));
                dispatch(setPackageId(result.data.package_id));
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

    const onSuccess = async (response) => {
        console.log('Login Success:', response);

        const token = response.tokenId;
        // Send token to backend for verification
        // const res = await fetch('YOUR_BACKEND_API_URL', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ token })
        // });

        // const data = await res.json();
        // console.log('Backend response:', data);
        // Handle the response, save the token, etc.
    };

    const onFailure = (response) => {
        console.log('Login Failed:', response);
    };

    return (
        <div className="wrapper-login">
            <img className="image" src={IMG} alt="Image" />
            <div className="container">
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
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                    {/* Facebook Login Button */}

                    {/* <Button
                        className="btn"
                        type="primary"
                        icon={<FacebookOutlined className="facebook-icon" />}
                        style={{
                            backgroundColor: '#4267B2',
                            borderColor: '#4267B2',
                            marginTop: '10px',
                            width: '100%',
                            textAlign: 'center',
                        }}
                        onClick={handleFacebookLogin}
                    >
                        Login with Facebook
                    </Button>
                    <div style={{ marginTop: '1rem' }}>
                        <GoogleLogin
                            clientId={loggingg}
                            buttonText="Login with Google"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={'http://localhost:3000'}
                        />
                    </div> */}

                    {/* Google Login Button */}

                    {/* <Button
                        type="primary"
                        className="btn"
                        icon={<FaGoogle className="google-icon" />}
                        style={{
                            backgroundColor: '#DB4437',
                            borderColor: '#DB4437',
                            marginTop: '10px',
                            width: '100%',
                            textAlign: 'center',
                        }}
                        onClick={handleGoogleLogin}
                    >
                        Login with Google
                    </Button> */}


                </form>

                <div className="register-section">
                    <h3 className="login-content-ask">
                        Want to become a member?
                    </h3>
                    <p className="login-content-signup">
                        <Link to={`/register`}>Register now</Link>
                    </p>
                </div>
            </div>

        </div>

    );
}

export default LoginPage;
