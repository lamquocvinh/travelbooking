import React, { useEffect, useState } from "react";
import "./UpdateRoom.scss";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { notification, Upload, Button } from "antd";
import { roomApi } from "../../../services/roomAPI";
import { UploadOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";

// Schema validation using yup
const schema = yup.object().shape({
    capacity_per_room: yup.number().min(1).max(6).required("Capacity is required").typeError('Capacity must be a number'),
    description: yup.string().required("Description is required").trim(),
    room_price: yup.number().min(0).required("Price is required").typeError('Price must be a number'),
    number_of_rooms: yup.number().min(0).required("Number of rooms is required").typeError('Number of rooms must be a number'),
    room_type_name: yup.string().required("Room name is required").trim(),
    conveniences: yup.object().shape({
        air_conditioning: yup.boolean(),
        tv: yup.boolean(),
        wifi: yup.boolean(),
        toiletries: yup.boolean(),
        kitchen: yup.boolean(),
        wardrobe: yup.boolean(),  // Ensure wardrobe is included in schema
    }),
    types: yup.object().shape({
        luxury: yup.boolean(),
        single_bedroom: yup.boolean(),
        twin_bedroom: yup.boolean(),
        double_bedroom: yup.boolean(),
    }),
});

function UpdateRoom() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { data } = roomApi.useGetRoomDetailQuery(id);
    const [Update] = roomApi.useUpdateRoomMutation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (data) {
            setValue('capacity_per_room', data?.data?.capacity_per_room);
            setValue('description', data?.data?.description);
            setValue('room_price', data?.data?.room_price);
            setValue('number_of_rooms', data?.data?.number_of_rooms);
            setValue('room_type_name', data?.data?.room_type_name);
            setValue('conveniences.air_conditioning', data?.data?.conveniences[0]?.air_conditioning);
            setValue('conveniences.tv', data?.data?.conveniences[0]?.tv);
            setValue('conveniences.wifi', data?.data?.conveniences[0]?.wifi);
            setValue('conveniences.toiletries', data?.data?.conveniences[0]?.toiletries);
            setValue('conveniences.kitchen', data?.data?.conveniences[0]?.kitchen);
            setValue('conveniences.wardrobe', data?.data?.conveniences[0]?.wardrobe);
            setValue('types.luxury', data?.data?.types[0]?.luxury);
            setValue('types.single_bedroom', data?.data?.types[0]?.single_bedroom);
            setValue('types.twin_bedroom', data?.data?.types[0]?.twin_bedroom);
            setValue('types.double_bedroom', data?.data?.types[0]?.double_bedroom);
        }
    }, [data, setValue]);

    // Handle form submission
    const onSubmit = async (formData) => {
        try {
            // Handle conveniences data
            const conveniences = {
                air_conditioning: formData.conveniences.air_conditioning || false,
                tv: formData.conveniences.tv || false,
                wifi: formData.conveniences.wifi || false,
                toiletries: formData.conveniences.toiletries || false,
                kitchen: formData.conveniences.kitchen || false,
                wardrobe: formData.conveniences.wardrobe || false,
            };

            // Handle types data
            const types = {
                luxury: formData.types.luxury || false,
                single_bedroom: formData.types.single_bedroom || false,
                twin_bedroom: formData.types.twin_bedroom || false,
                double_bedroom: formData.types.double_bedroom || false,
            };

            // Prepare room data
            const roomData = {
                description: formData.description,
                room_type_name: formData.room_type_name,
                number_of_rooms: formData.number_of_rooms,
                room_price: formData.room_price,
                capacity_per_room: formData.capacity_per_room,
                conveniences: [conveniences],
                types: types,
            };

            // Call API to update room
            await Update({ roomTypeId: Number(id), roomData }).unwrap();

            // Show success notification
            notification.success({
                message: "Success",
                description: "Room updated successfully!",
            });

            // Reset form after successful update
            reset();

            // Navigate back to previous page
            window.history.back();

        } catch (error) {
            // Show error notification
            notification.error({
                message: "Error",
                description: error.message,
            });
            console.error("Error:", error.message);
        }
    };

    return (
        <div className="update-room-wrapper">
            <h2 className="title">Update Room</h2>
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
                    <h3>Type room:</h3>
                    <div className="conveniences">
                        {Object.keys(schema.fields.types.fields).map(key => (
                            <div className="item-check" key={key}>
                                <Controller
                                    name={`types.${key}`}
                                    control={control}
                                    render={({ field }) => (
                                        <input type="checkbox" {...field} checked={!!field.value} />
                                    )}
                                />
                                <label className="label">
                                    {key.slice(0, 1).toUpperCase().concat(key.slice(1, key.length)).replace('_', ' ')}
                                </label>
                            </div>
                        ))}
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
                                        <input type="checkbox" {...field} checked={!!field.value} />
                                    )}
                                />
                                <label className="label">
                                    {key.slice(0, 1).toUpperCase().concat(key.slice(1, key.length)).replace('_', ' ')}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="btn-group">
                    <button className="cancel" type="reset" onClick={() => {
                        reset();
                        window.history.back();
                    }}>
                        Cancel
                    </button>
                    <button className="create" type="submit">Update</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateRoom;
