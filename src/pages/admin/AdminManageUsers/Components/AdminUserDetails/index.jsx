import "./AdminUserDetails.scss";
import { useGetUserDetailsQuery } from '../../../../../services/userAPI';
import { useParams } from "react-router-dom";
import { Spin, Tag } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

function AdminUserDetails() {
    const params = useParams();
    const { data, isLoading } = useGetUserDetailsQuery(params.userId);
    const DOB = new Date(data?.date_of_birth);

    return (
        <div className="admin-user-details-wrapper">
            <Spin spinning={isLoading} >
                <div className="card">
                    <div className="booking-info">
                        <h2 className="item">User Details</h2>
                        <div className="item">
                            {data?.is_active === true &&
                                <Tag icon={<CheckCircleOutlined />} color="success">
                                    ACTIVE
                                </Tag>
                            }
                            {data?.is_active === false &&
                                <Tag icon={<ExclamationCircleOutlined />} color="warning">
                                    INACTIVE
                                </Tag>
                            }
                        </div>
                        <button className="item cancel" type="reset" onClick={() => {
                            window.history.back();
                        }}>
                            <CloseCircleOutlined />
                        </button>
                    </div>
                    <div className="details">
                        <div className="item-50">
                            <label>Fullname</label>
                            <p className="input">{data?.full_name}</p>
                        </div>
                        <div className="item-50">
                            <label>ID</label>
                            <p className="input">{data?.id}</p>
                        </div>
                        <div className="item-50">
                            <label>Email</label>
                            <p className="input">{data?.email}</p>
                        </div>
                        <div className="item-50">
                            <label>Phone</label>
                            <p className="input">{data?.phone_number}</p>
                        </div>
                        <div className="item-50">
                            <label>Date of birth</label>
                            <p className="input">{data?.date_of_birth != null && DOB?.toDateString()}</p>
                        </div>
                        <div className="item-50">
                            <label>Address</label>
                            <p className="input">{data?.address}</p>
                        </div>
                        <div className="item-50">
                            <label>Facebook ID</label>
                            <p className="input">{data?.facebook_account_id}</p>
                        </div>
                        <div className="item-50">
                            <label>Google ID</label>
                            <p className="input">{data?.google_account_id}</p>
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    );
}

export default AdminUserDetails;