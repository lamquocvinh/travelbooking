import { useDispatch, useSelector } from "react-redux";
import "../scss/roomlist.scss"
import { Link } from 'react-router-dom';
import { setHotelInfo } from "../../../../../slices/bookingSlice";
import { Badge } from "antd";

const RoomList = ({ roomTypes, hotel_name, hotel_Id }) => {
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.booking.rooms);
  const availableRoom = roomTypes?.filter((room) => room.number_of_rooms >= rooms)

  return (
    <div className="rooms-section-wrapper">
      <p className='rooms-section-title'>Room List</p>
      {availableRoom?.length > 0 ?
        <div className='rooms-list'>
          {availableRoom?.map((roomType, index) => (
            <Badge.Ribbon key={index} text={`${roomType?.number_of_rooms} room(s) left.`} color="red" >
              <div className="room-card">
                <img
                  src={roomType?.image_urls?.[0]?.image_url || 'default_image_url_here'}
                  alt={roomType?.roomType_name || 'default_roomType_name'}
                  className="roomType-img"
                />
                <div className="roomType-info">
                  <div className='body-start'>
                    <h2 className="roomType-name">{roomType?.room_type_name}</h2>
                    <div className='more-info'>
                      <span className='info-item'>Max: {roomType?.capacity_per_room} Guests</span>
                      {Object.entries(roomType?.types?.[0])
                        .filter(([key, value]) => (key !== "id" && value !== false))
                        .map(([key, value]) => (
                          <span key={key} className='info-item'>
                            {key.toUpperCase().slice(0, 1).concat(key.slice(1, key.length))}
                          </span>
                        ))}
                    </div>
                    <div className='roomType-conveniences'>
                      {roomType?.conveniences && roomType?.conveniences.length > 0 ? (
                        Object.entries(roomType?.conveniences?.[0])
                          .filter(([key, value]) => (key !== "id" && value !== false))
                          .map(([key, value]) => (
                            <span key={key} className='convenience-item'>
                              {key.toUpperCase().slice(0, 1).concat(key.slice(1, key.length))}
                            </span>
                          ))
                      ) : (
                        <p className="no-conveniences">No conveniences available</p>
                      )}
                    </div>
                  </div>
                  <div className='body-end'>
                    <div className="price">
                      From <span className='number'>{roomType?.room_price?.toLocaleString()}</span> VND
                    </div>
                    <Link className="roomType-book-now" to={`/room-details/${roomType?.id}`} onClick={() => {
                      dispatch(setHotelInfo({
                        hotelId: hotel_Id,
                        hotelName: hotel_name,
                      }))
                    }}>
                      DETAIL
                    </Link>
                  </div>
                </div>
              </div>
            </Badge.Ribbon>
          ))}
        </div>
        :
        <div className='rooms-list'>
          <p className="no-data">No room suitable.</p>
        </div>
      }
    </div >
  );
};

export default RoomList;
