import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./PaymentReturnPage.scss";
import Step1 from "../paymentPage/Components/Step1";
import Step2 from "../paymentPage/Components/Step2";
import Step3 from "../paymentPage/Components/Step3";
import { Steps } from 'antd';


function PaymentReturnPage() {
    const params = useParams();

    const [current, setCurrent] = useState(2);
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const steps = [
        {
            title: 'Customer information',
            content: <Step1 nextStep={() => { next() }} />,
        },
        {
            title: 'Detail payment',
            content: <Step2 backStep={() => { prev() }} />,
        },
        {
            title: `${params.status === "success" ? "Booking confirmed!" : "Booking Failed"}`,
            content: <Step3 />,
        },
    ];
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, []);
    return (
        <div className="payment-wrapper">
            <div className="container">
                <h1 className="heading">Payment Page</h1>
                <Steps className="progress" current={current} items={items} status={params.status === "success" ? "finish" : "error"} />
                <div>{steps[current].content}</div>
            </div>
        </div>
    );
}

export default PaymentReturnPage;
