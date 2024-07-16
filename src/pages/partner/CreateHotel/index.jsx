import React, { useState, useEffect } from 'react';
import "./CreateHotel.scss";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VietnameseProvinces } from "../../../utils/utils";
import { useDispatch } from "react-redux";
import { notification, Button, Upload, Form } from "antd";
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { hotelApi } from "../../../services/hotelAPI";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-geosearch/dist/style.css';
import 'leaflet-geosearch/assets/css/leaflet.css';
import { ErrorMessage } from '@hookform/error-message';


const schema = yup.object().shape({
    rating: yup.number("Rating from 1-5").min(1).max(5).required("This field is required"),
    description: yup.string().required("This field is required").trim(),
    brand: yup.string(),
    hotel_name: yup.string().required("This field is required").trim(),
    businessLicense: yup.array().of(yup.mixed().required("This field is required")).min(1, "Business license file is required"),
    images: yup.array()
        .min(4, "You must upload at least 4 images."),
    conveniences: yup.object().required("At least one convenience must be selected").shape({
        free_breakfast: yup.boolean(),
        pick_up_drop_off: yup.boolean(),
        restaurant: yup.boolean(),
        bar: yup.boolean(),
        pool: yup.boolean(),
        free_internet: yup.boolean(),
        reception_24h: yup.boolean(),
        laundry: yup.boolean(),
    }).test(
        'at-least-one-true',
        'At least one convenience must be selected',
        value => Object.values(value).some(v => v === true)
    ),
    location: yup.object().shape({
        address: yup.string().required("This field is required").trim(),
        province: yup.string().required("This field is required").trim(),
        longitude: yup.string().required("This field is required").trim(),
        latitude: yup.string().required("This field is required").trim(),
    }),
});

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const LocationMarker = ({ setPosition }) => {
    const [markerPosition, setMarkerPosition] = useState(null);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setMarkerPosition([lat, lng]);
            setPosition({ latitude: lat, longitude: lng });
        }
    });

    return markerPosition === null ? null : (
        <Marker position={markerPosition}></Marker>
    );
};

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

const SearchField = ({ setPosition }) => {
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({
            provider,
            style: 'bar',
            showMarker: false,
            autoClose: true,
            retainZoomLevel: false,
        });

        map.addControl(searchControl);

        map.on('geosearch/showlocation', (result) => {
            const { x, y } = result.location;
            setPosition({ latitude: y, longitude: x });
            map.setView([y, x], 15);
        });

        return () => map.removeControl(searchControl);
    }, [map, setPosition]);

    return null;
};

function CreateHotel() {
    const dispatch = useDispatch();
    const [createHotel, { isLoading }] = hotelApi.useCreateHotelMutation();
    const [putLicense, { isLoading: isLicenseLoading, isSuccess, isError, error }] = hotelApi.usePutLicenseMutation();
    const [mapCenter, setMapCenter] = useState([10.740321, 106.678499]);
    const [position, setPosition] = useState(null);

    const [fileList, setFileList] = useState([]);
    const [putImage] = hotelApi.usePutHotelImageMutation();
    const [form] = Form.useForm(); // Tạo instance của form
    const handleReset = () => {
        form.resetFields(); // Reset form về trạng thái ban đầu
        setFileList([]); // Xóa danh sách file
    };
    const handleChange = ({ fileList }) => setFileList(fileList);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const businessLicense = watch("businessLicense");

    useEffect(() => {
        if (position) {
            setValue('location.latitude', position.latitude);
            setValue('location.longitude', position.longitude);
        }
    }, [position, setValue]);

    const onSubmit = async (data) => {
        const conveniences = Object.keys(data.conveniences).map(key => ({
            [key]: data.conveniences[key]
        }));
        data.conveniences = conveniences;

        if (fileList.length < 4) {
            notification.error({
                message: "Error",
                description: "You must upload at least 4 images.",
            });
            return;
        }

        if (!businessLicense || businessLicense.length === 0) {
            notification.error({
                message: "Error",
                description: "Business license files are required.",
            });
            return;
        }

        const formData = new FormData();
        businessLicense.forEach(file => {
            formData.append('license', file);
        });
        try {
            const response = await createHotel(data).unwrap();

            await putLicense({ idHotel: response?.data?.id, license: formData }).unwrap();

            await putImage({ idHotel: response?.data?.id, images: fileList }).unwrap();

            notification.success({
                message: "Success",
                description: "Hotel created successfully!",
            });
            reset();
            window.history.back();
        } catch (error) {
            notification.error({
                message: "Error",
                description: error?.data?.message,
            });
        }
    };

    return (
        <div className="create-hotel-wrapper">
            <h2 className="title">New Hotel</h2>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <div className="item-50">
                    <label>Hotel Name*</label>
                    <input className="input" type="text" {...register('hotel_name')} placeholder="Enter hotel name" />
                    <p className="error-message">{errors.hotel_name?.message}</p>
                </div>
                <div className="item-25">
                    <label>Rating* </label>
                    <input className="input" type="number" {...register('rating')} placeholder="Enter rating star" defaultValue={1} />
                    <p className="error-message">{errors.rating?.message}</p>
                </div>
                <div className="item-25">
                    <label>Brand: </label>
                    <input className="input" type="text" {...register('brand')} placeholder="Enter brand" />
                    <p className="error-message">{errors.brand?.message}</p>
                </div>
                <div className="item-100">
                    <label>Description*</label>
                    <textarea className="input" type="text" {...register('description')} placeholder="Describe about hotel" />
                    <p className="error-message">{errors.description?.message}</p>
                </div>
                <div className="item-100">
                    <label>Business License*</label>
                    <Controller
                        name="businessLicense"
                        control={control}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <Upload
                                listType="picture"
                                beforeUpload={(file) => {
                                    const newValue = [...(value || []), file];
                                    onChange(newValue);
                                    return false;
                                }}
                                onRemove={(file) => {
                                    const newValue = (value || []).filter(
                                        (item) => item.uid !== file.uid
                                    );
                                    onChange(newValue);
                                }}
                                fileList={(value || []).map((file) => ({
                                    uid: file.uid,
                                    name: file.name,
                                    status: "done",
                                    url: URL.createObjectURL(file)
                                }))}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        )}
                    />
                    <p className="error-message">{errors.businessLicense?.message}</p>
                </div>
                <div className="item-100">
                    <label>Image Hotel*</label>
                    <Form.Item
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload.Dragger
                            name="files"
                            beforeUpload={() => false} // Prevent automatic upload
                            fileList={fileList}
                            onChange={handleChange}
                            listType="picture"
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <div className="ant-upload-text">Click or drag file to this area to upload</div>
                            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                        </Upload.Dragger>
                    </Form.Item>
                    <p className="error-message">{errors.businessLicense?.message}</p>
                </div>

                <div className="item-100">
                    <h3>Location:</h3>
                    <div className="location">
                        <div className="item-75">
                            <label>Address*</label>
                            <input className="input" type="text" {...register('location.address')} placeholder="Enter address" />
                            <p className="error-message">{errors.location?.address?.message}</p>
                        </div>
                        <div className="item-25">
                            <label>Province*</label>
                            <select className="input" {...register('location.province')} >
                                {VietnameseProvinces.map((province, index) => (
                                    <option key={index} value={province}>{province}</option>
                                ))}
                            </select>
                            <p className="error-message">{errors.location?.province?.message}</p>
                        </div>
                    </div>
                </div>
                <div className="item-100">
                    <h3>Conveniences:</h3>
                    <div className="conveniences">
                        {Object.keys(schema.fields.conveniences.fields).map(key => (
                            <div className="item-check" key={key}>
                                <Controller
                                    name={`conveniences.${key}`}
                                    control={control}
                                    render={({ field }) => (
                                        <input type="checkbox" {...field} />
                                    )}
                                />
                                <label className="label">
                                    {key.slice(0, 1).toUpperCase().concat(key.slice(1, key.length)).replace(
                                        '_',
                                        ' '
                                    )}
                                </label>
                            </div>
                        ))}
                    </div>
                    <ErrorMessage
                        errors={errors}
                        name="conveniences"
                        render={({ message }) => <p style={{ color: 'red' }}>{message}</p>}
                    />
                </div>
                <div className="item-100">
                    <MapContainer center={mapCenter} zoom={15} style={{ height: '500px', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <SearchField setPosition={setPosition} />
                        <LocationMarker setPosition={setPosition} dataPosition={position} />
                    </MapContainer>
                </div>
                <div className="btn-group">
                    <button className="cancel" type="reset" onClick={() => {
                        reset();
                        window.history.back();
                    }}>
                        Cancel
                    </button>
                    <button className="create" type="submit">Create</button>
                </div>
            </form>
        </div>
    );
}

export default CreateHotel;
