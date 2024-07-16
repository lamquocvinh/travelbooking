import "./Packages.scss";
import { useGetAllPackagesQuery } from "../../../../../services/packageAPI";
import { Skeleton } from "antd";

function Packages() {
    const { data, isLoading } = useGetAllPackagesQuery();

    return (
        <>
            {isLoading ?
                <Skeleton active className="package-container" />
                :
                <div className="package-container">
                    {data?.data?.map(pack => (
                        <div className="package" key={pack.id}>
                            <h2>{`Package ${pack.name}`}</h2>
                            <div className="description">Unlock features to start trading.</div>
                            <div className="price">{`${pack.price.toLocaleString()} đ`}</div>
                            <div className="description">{`${pack.description}`}</div>
                            <div className="description">This package is valid for <strong>{pack.duration}</strong> days </div>
                        </div>
                    ))}
                </div>
            }
        </>

    );
}

export default Packages;