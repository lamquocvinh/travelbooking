import "./AdminBookingExport.scss"
import {
    useExportBookingFullMutation,
    useExportBookingMonthMutation,
    useExportBookingYearMutation
} from '../../../../../services/bookingAPI';
import { useGetPartnersQuery } from '../../../../../services/userAPI';
import { useNavigate } from "react-router-dom";
import {
    CloseCircleOutlined,
    ExportOutlined,
} from '@ant-design/icons';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { notification, Spin } from "antd";
import { useEffect, useState } from "react";
import { saveAs } from 'file-saver';

const currentDate = new Date();

const days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
];

const months = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
];

const years = [
    currentDate.getFullYear() - 0,
    currentDate.getFullYear() - 1,
    currentDate.getFullYear() - 2,
    currentDate.getFullYear() - 3,
    currentDate.getFullYear() - 4
];

const schema = yup.object().shape({
    partnerId: yup.number().moreThan(0, "Please select partner"),
    day: yup.number(),
    month: yup.number(),
    year: yup.number(),
});

function AdminBookingExport() {
    const navigate = useNavigate()
    const [exportBookingFull] = useExportBookingFullMutation();
    const [exportBookingMonth] = useExportBookingMonthMutation();
    const [exportBookingYear] = useExportBookingYearMutation();
    const { data: partners, refetch } = useGetPartnersQuery();

    const [selectedMonth, setSelectedMonth] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            let result;
            if (data?.month > 0 && data?.day > 0)
                result = await exportBookingFull(data);
            else if (data?.month > 0)
                result = await exportBookingMonth(data);
            else
                result = await exportBookingYear(data);
            if (result?.error) {
                notification.error({
                    message: "Error",
                    description: "Export failed."
                })
            } else {
                const blob = new Blob([result?.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, `partnerId_${data.partnerId > 0 && data.partnerId}_bookings_report_${data.year}_${data.month > 0 ? data.month : 0}_${data?.day > 0 ? data?.day : 0}`);
                reset();
                notification.success({
                    message: "Export successfully."
                })
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Export failed."
            })
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refetch()
    }, []);

    return (
        <div className='admin-export-bookings-wrapper'>
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <Spin spinning={isLoading}>
                    <div className="export-info">
                        <h2 className="item">Export Bookings</h2>
                        <button className="item cancel" type="reset" onClick={() => {
                            navigate(-1);
                        }}>
                            <CloseCircleOutlined />
                        </button>
                    </div>
                    <div className="details">
                        <div className="item-25">
                            <label>Partner</label>
                            <select className="input" {...register("partnerId")} >
                                <option value={0}>Select partner</option>
                                {partners?.map((partner, index) => (
                                    <option key={index} value={partner.id}>{partner.full_name}</option>
                                ))}
                            </select>
                            <p className="error-message">{errors.partnerId?.message}</p>
                        </div>
                        <div className="item-25">
                            <label>Year</label>
                            <select className="input" {...register("year")}>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </select>
                            <p className="error-message">{errors.year?.message}</p>
                        </div>
                        <div className="item-25">
                            <label>Month</label>
                            <select className="input" {...register("month")} onChange={handleMonthChange}>
                                <option value={0}>Select month</option>
                                {months.map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </select>
                            <p className="error-message">{errors.month?.message}</p>
                        </div>
                        <div className="item-25">
                            <label>Day</label>
                            <select className="input" {...register("day")} disabled={selectedMonth <= 0}>
                                <option value={0}>Select day</option>
                                {days.map((day, index) => (
                                    <option key={index} value={day}>{day}</option>
                                ))}
                            </select>
                            <p className="error-message">{errors.day?.message}</p>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button className="cancel" type="reset" onClick={() => {
                            reset();
                            navigate(-1);
                        }}>
                            Cancel
                        </button>
                        <button className="export" type="submit">
                            <ExportOutlined />
                            Export
                        </button>
                    </div>
                </Spin>
            </form>
        </div >
    );
}

export default AdminBookingExport;