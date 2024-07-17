import "./CreateRoom.scss";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { notification, Upload, Button, Spin } from "antd";
import { roomApi } from "../../../services/roomAPI";
import { UploadOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";

// Schema validation using yup
const schema = yup.object().shape({
    capacity_per_room: yup.number().min(1).max(6).required("Capacity is required").typeError('Capacity must be a number'),
    description: yup.string().required("Description is required").trim(),
    room_price: yup.number().min(0).required("Price is required").typeError('Price must be a number'),
    number_of_rooms: yup.number().min(0).required("Number of rooms is required").typeError('Number of rooms must be a number'),
    images: yup.mixed().required("Images are required"),
    room_type_name: yup.string().required("Room name is required").trim(),
    conveniences: yup.object().shape({
        air_conditioning: yup.boolean(),
        tv: yup.boolean(),
        wifi: yup.boolean(),
        toiletries: yup.boolean(),
        kitchen: yup.boolean(),
        wardrobe: yup.boolean(),
    }).test(
        'at-least-one-true',
        'At least one convenience must be selected',
        value => Object.values(value).some(v => v === true)
    ),
    types: yup.object().shape({
        luxury: yup.boolean(),
        single_bedroom: yup.boolean(),
        twin_bedroom: yup.boolean(),
        double_bedroom: yup.boolean(),
    }).test(
        'at-least-one-bedroom',
        'At least one of single bedroom, twin bedroom, or double bedroom must be selected',
        value => {
            const { luxury, ...bedrooms } = value;
            return Object.values(bedrooms).some(v => v === true);
        }
    ),
});

function CreateRoom() {
    const dispatch = useDispatch();
    const { id } = useParams();

    const [createRoom, { isLoading: createRoomLoading }] = roomApi.useCreateRoomMutation();
    const [putRoomImage, { isLoading: putRoomImageLoading }] = roomApi.usePutRoomImageMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        control,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const image = watch("images");

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            // Handle conveniences data
            const conveniences = [{
                air_conditioning: data.conveniences.air_conditioning || false,
                tv: data.conveniences.tv || false,
                wifi: data.conveniences.wifi || false,
                toiletries: data.conveniences.toiletries || false,
                kitchen: data.conveniences.kitchen || false,
            }];

            // Handle types data
            const types = {
                luxury: data.types.luxury || false,
                single_bedroom: data.types.single_bedroom || false,
                twin_bedroom: data.types.twin_bedroom || false,
                double_bedroom: data.types.double_bedroom || false,
            };

            // Prepare room data
            const roomData = {
                hotel_id: Number(id),
                description: data.description,
                room_type_name: data.room_type_name,
                number_of_rooms: data.number_of_rooms,
                room_price: data.room_price,
                capacity_per_room: data.capacity_per_room,
                conveniences: conveniences,
                types: types,
            };

            // Check if images are uploaded
            if (!image || image.length === 0) {
                notification.error({
                    message: "Error",
                    description: "An image of the room is required.",
                });
                return;
            }

            // Prepare formData for image upload
            const formData = new FormData();
            image.forEach((file) => {
                formData.append('images', file);
            });

            // Call API to create room
            const createRoomResponse = await createRoom(roomData).unwrap();
            console.log("Created room response:", createRoomResponse);

            // Call API to upload room images
            await putRoomImage({ roomTypeId: createRoomResponse?.data?.id, images: formData }).unwrap();

            // Show success notification
            notification.success({
                message: "Success",
                description: "Room created successfully!",
            });

            // Reset form after successful creation
            reset();

            // Navigate back to previous page
            window.history.back();

        } catch (error) {
            // Show error notification
            notification.error({
                message: "Error",
                description: error?.data?.message,
            });
        }
    };

    if (createRoomLoading || putRoomImageLoading) {
        return <div style={{ "display": "flex", "justifyContent": "center", "alignItems": "center", "height": "50vh" }}><Spin></Spin></div>
    }

    return (
        <div className="create-hotel-wrapper">
            <h2 className="title">New Room</h2>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <div className="item-50">
                    <label>Room Name*:</label>
                    <input className="input" type="text" {...register('room_type_name')} placeholder="Enter room name" />
                    <p className="error-message">{errors.room_type_name?.message}</p>
                </div>

                <div className="item-50">
                    <label>Price*:</label>
                    <input className="input" type="text" {...register('room_price')} placeholder="Enter price" />
                    <p className="error-message">{errors.room_price?.message}</p>
                </div>
                <div className="item-50">
                    <label>Capacity*:</label>
                    <input className="input" type="text" {...register('capacity_per_room')} placeholder="Enter capacity of each room " />
                    <p className="error-message">{errors.capacity_per_room?.message}</p>
                </div>
                <div className="item-50">
                    <label>Number of room*:</label>
                    <input className="input" type="text" {...register('number_of_rooms')} placeholder="Enter number of room" />
                    <p className="error-message">{errors.number_of_rooms?.message}</p>
                </div>
                <div className="item-100">
                    <label>Description*</label>
                    <textarea className="input" type="text" {...register('description')} placeholder="Describe about room" />
                    <p className="error-message">{errors.description?.message}</p>
                </div>
                <div className="item-100">
                    <label>Image Room*</label>
                    <Controller
                        name="images"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Upload
                                listType="picture"
                                beforeUpload={(file) => {
                                    onChange([...(value || []), file]);
                                    return false;
                                }}
                                onRemove={(file) => {
                                    const filteredValue = value.filter((v) => v.uid !== file.uid);
                                    onChange(filteredValue);
                                }}
                                fileList={value ? value.map((file) => ({
                                    uid: file.uid,
                                    name: file.name,
                                    status: 'done',
                                    url: URL.createObjectURL(file),
                                })) : []}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        )}
                    />
                    <p className="error-message">{errors.images?.message}</p>
                </div>
                <div className="item-100">
                    <h3>Type room:</h3>
                    <div className="conveniences">
                        {Object.keys(schema.fields.types.fields).map(key => (
                            <div className="item-check" key={key}>
                                <Controller
                                    name={`types.${key}`}
                                    control={control}
                                    render={({ field }) => (
                                        <input type="checkbox" {...field} />
                                    )}
                                />
                                <label className="label">
                                    {key.slice(0, 1).toUpperCase().concat(key.slice(1, key.length)).replace('_', ' ')}
                                </label>
                            </div>
                        ))}
                    </div>
                    <p className="error-message">{errors.types?.root?.message}</p>
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
                                    {key.slice(0, 1).toUpperCase().concat(key.slice(1, key.length)).replace('_', ' ')}
                                </label>
                            </div>
                        ))}
                    </div>
                    <p className="error-message">{errors.conveniences?.root?.message}</p>
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

export default CreateRoom;
