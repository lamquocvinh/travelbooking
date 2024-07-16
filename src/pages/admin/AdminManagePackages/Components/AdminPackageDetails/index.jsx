import "./AdminPackageDetails.scss";
import { useGetPackageDetailsQuery } from '../../../../../services/packageAPI';
import { useParams } from "react-router-dom";
import {
    CloseCircleOutlined,
} from '@ant-design/icons';
import { Spin } from "antd";

function AdminPackageDetails() {
    const params = useParams();
    const { data, isLoading } = useGetPackageDetailsQuery(params.packageId);

    return (
        <div className="admin-package-details-wrapper">
            <div className="card">
                <div className="package-info">
                    <h2 className="item">Package Details</h2>
                    <button className="item cancel" type="reset" onClick={() => {
                        window.history.back();
                    }}>
                        <CloseCircleOutlined />
                    </button>
                </div>
                <Spin spinning={isLoading}>
                    <div className="details">
                        <div className="item-50">
                            <label>Package ID</label>
                            <p className="input">{data?.data["id"]}</p>
                        </div>
                        <div className="item-50">
                            <label>Package name</label>
                            <p className="input">{data?.data["name"]}</p>
                        </div>
                        <div className="item-50">
                            <label>Duration</label>
                            <p className="input">{data?.data["duration"].toLocaleString()} Days</p>
                        </div>
                        <div className="item-50">
                            <label>Price</label>
                            <p className="input">{data?.data["price"].toLocaleString()} VND</p>
                        </div>
                        <div className="item-100">
                            <label>Description</label>
                            <p className="input">{data?.data["description"]}</p>
                        </div>
                    </div>
                </Spin>
            </div>
        </div>
    );
}

export default AdminPackageDetails;