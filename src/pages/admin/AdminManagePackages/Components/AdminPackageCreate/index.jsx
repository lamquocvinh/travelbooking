import "./AdminPackageCreate.scss";
import { useCreatePackageMutation } from '../../../../../services/packageAPI';
import { useNavigate } from "react-router-dom";
import {
    CloseCircleOutlined,
} from '@ant-design/icons';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Spin, notification } from "antd";

const schema = yup.object().shape({
    name: yup.string().required("This field is required").trim(),
    description: yup.string().required("This field is required").trim(),
    duration: yup.number().required("This field is required").min(30, "Duration must at least 30 days."),
    price: yup.number().required("This field is required").min(50000000, "Price must at least 50.000.000 VND"),
});

function AdminPackageCreate() {
    const navigate = useNavigate()
    const [create, { isLoading }] = useCreatePackageMutation();

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
            const result = await create(data);
            if (result?.data?.status == "CREATED") {
                reset();
                notification.success({
                    message: result?.data?.message
                })
                navigate(-1)
            } else {
                notification.error({
                    message: "Error",
                    description: result?.error?.data?.message
                })
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message
            })
        }
    };

    return (
        <div className="admin-package-create-wrapper">
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <Spin spinning={isLoading}>
                    <div className="package-info">
                        <h2 className="item">Package Create</h2>
                        <button className="item cancel" type="reset" onClick={() => {
                            navigate(-1);
                        }}>
                            <CloseCircleOutlined />
                        </button>
                    </div>
                    <div className="details">
                        <div className="item-50">
                            <label>Package name</label>
                            <input className="input" {...register("name")}></input>
                            <p className="error-message">{errors.name?.message}</p>
                        </div>
                        <div className="item-25">
                            <label>Duration (Days)</label>
                            <input className="input" type="number" {...register("duration")} defaultValue={0}></input>
                            <p className="error-message">{errors.duration?.message}</p>
                        </div>
                        <div className="item-25">
                            <label>Price (VND)</label>
                            <input className="input" type="number" {...register("price")} defaultValue={0}></input>
                            <p className="error-message">{errors.price?.message}</p>
                        </div>
                        <div className="item-100">
                            <label>Description</label>
                            <input className="input" {...register("description")}></input>
                            <p className="error-message">{errors.description?.message}</p>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button className="cancel" type="reset" onClick={() => {
                            reset();
                            navigate(-1);
                        }}>
                            Cancel
                        </button>
                        <button className="create" type="submit">Create</button>
                    </div>
                </Spin>
            </form>
        </div>
    );
}

export default AdminPackageCreate;