import { useEffect } from "react";
import "./Step3.scss";
import { useParams, Link } from "react-router-dom";

function Step3() {
    const params = useParams();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, []);

    return (
        <div>
            {params.status === "success"
                ?
                <div className="step3-wrapper">
                    <h3 className="title">Booking Completed!</h3>
                    <p className="thank-you">Thank you!</p>
                    <p className="note">Your booking detail has been sent to your email.</p>
                    <Link to={"/"} className="back-btn" onClick={() => {
                        sessionStorage.removeItem("paymentAccess")
                    }}>Go to home page</Link>
                </div>
                :
                <div className="step3-wrapper">
                    <h3 className="title">Booking Failed!</h3>
                    <p className="thank-you">Some thing wrong in process payment.</p>
                    <p className="note">Please check again and try later.</p>
                    <Link to={"/"} className="back-btn" onClick={() => {
                        sessionStorage.removeItem("paymentAccess")
                    }}>Go to home page</Link>
                </div>
            }
        </div>
    );
}

export default Step3;