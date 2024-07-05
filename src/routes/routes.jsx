import { createBrowserRouter } from "react-router-dom";
import Loadable from "./Loadable";
import MainLayout from "../layout/MainLayout";
import SecondLayout from "../layout/SecondLayout";
import AuthGuard from "./AuthGuard";

const Login = Loadable({ loader: () => import("../pages/user/login/login") });
const errorPage = Loadable({ loader: () => import("../pages/error/Error") });
const RoomDetailsPage = Loadable({ loader: () => import("../pages/user/roomDetailsPage") });
const HotelList = Loadable({ loader: () => import("../pages/user/hotellist/HotelList") });
const HotelDetail = Loadable({ loader: () => import("../pages/user/hotelDetailsPage/HotelDetailsPage") });
const Register = Loadable({ loader: () => import("../pages/user/register/Register") });

const Profile = Loadable({ loader: () => import("../pages/user/profile/Components/Profile/Profile") });
const Change = Loadable({ loader: () => import("../pages/user/profile/Components/ChangePassword/Change") });
const HomePage = Loadable({ loader: () => import("../pages/user/HomePage/HomePage") });
const User = Loadable({ loader: () => import("../pages/user/profile/index") });
const Booking = Loadable({ loader: () => import("../pages/user/profile/Components/Booking/Booking") });
const Invoice = Loadable({ loader: () => import("../pages/user/profile/Components/Invoice/Invoice") });
const Review = Loadable({ loader: () => import("../pages/user/profile/Components/Review/Review") });
const PaymentPage = Loadable({ loader: () => import("../pages/user/paymentPage") });
const PaymentReturnPage = Loadable({ loader: () => import("../pages/user/paymentReturnPage") });

// admin page
const Dashboard = Loadable({ loader: () => import("../pages/admin/Dashboard") });
const AdminManageBookings = Loadable({ loader: () => import("../pages/admin/AdminManageBookings") });
const AdminBookingDetails = Loadable({ loader: () => import("../pages/admin/AdminManageBookings/Components/AdminBookingDetails") });
const AdminManageUsers = Loadable({ loader: () => import("../pages/admin/AdminManageUsers") });
const AdminUserDetails = Loadable({ loader: () => import("../pages/admin/AdminManageUsers/Components/AdminUserDetails") });
const AdminManagePartners = Loadable({ loader: () => import("../pages/admin/AdminManagePartners") });
const AdminPartnerDetails = Loadable({ loader: () => import("../pages/admin/AdminManagePartners/Components/AdminPartnerDetails") });
const AdminManageHotels = Loadable({ loader: () => import("../pages/admin/AdminManageHotels") });
const AdminHotelDetails = Loadable({ loader: () => import("../pages/admin/AdminManageHotels/Components/AdminHotelDetails") });
const AdminManagePackages = Loadable({ loader: () => import("../pages/admin/AdminManagePackages") });
const AdminPackageDetails = Loadable({ loader: () => import("../pages/admin/AdminManagePackages/Components/AdminPackageDetails") });
const AdminPackageCreate = Loadable({ loader: () => import("../pages/admin/AdminManagePackages/Components/AdminPackageCreate") });
const AdminPackageEdit = Loadable({ loader: () => import("../pages/admin/AdminManagePackages/Components/AdminPackageEdit") });
const AdminManageConveniences = Loadable({ loader: () => import("../pages/admin/AdminManageConveniences") });

// partner page
const ViewBooking = Loadable({ loader: () => import("../pages/partner/ViewBooking/ViewBooking") });
const ManageHotel = Loadable({ loader: () => import("../pages/partner/ManageHotel/ManageHotel") });
const PartnerHotelDetails = Loadable({ loader: () => import("../pages/partner/ManageHotel/Components/PartnerHotelDetails") });
const CreateHotel = Loadable({ loader: () => import("../pages/partner/CreateHotel") });
const Edit = Loadable({ loader: () => import("../pages/partner/EditHotel/EditHotel") });
const Room = Loadable({ loader: () => import("../pages/partner/ManageRoom/ManageRoom") });
const CreateRoom = Loadable({ loader: () => import("../pages/partner/CreateRoom/CreateRoom") });
const RoomDetails = Loadable({ loader: () => import("../pages/partner/RoomDetail/RoomDetail") });
const UpdateRoom = Loadable({ loader: () => import("../pages/partner/UpdateRoom/UpdateRoom") });
const Packet = Loadable({ loader: () => import("../pages/partner/Packet/Packet") });


const Admin = Loadable({
  loader: () => import("../pages/admin/Admin"),
});
const partner = Loadable({
  loader: () => import("../pages/partner/Partner"),
});
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: Login
      },
      {
        path: "/",
        element: <AuthGuard />,
        children: [
          {
            path: "/user",
            element: User,
            children: [

              {
                path: "profile",
                element: Profile,
              },
              {
                path: "booking",
                element: Booking,
              },
              {
                path: "invoice",
                element: Invoice,
              },
              {
                path: "review",
                element: Review,
              },
              {
                path: "change-password",
                element: Change,
              },
            ]
          },
        ],

      },
      {
        index: true,
        element: HomePage,
      },
      {
        path: "/view-hotels",
        element: HotelList,
      },
      {
        path: "/hotel-detail/:hotelId",
        element: HotelDetail,
      },
      {
        path: "/room-details/:roomId",
        element: RoomDetailsPage,
      },
      {
        path: "/register",
        element: Register
      },
      {
        path: "/payment",
        element: PaymentPage,
      },
      {
        path: "/payment-return/:status",
        element: PaymentReturnPage,
      },
      ////////////// add for more no login
    ]
  },
  {
    element: <SecondLayout />,
    children: [
      {
        path: "/",
        element: <AuthGuard />,
        children: [
          {
            path: "/admin",
            element: Admin,
            children: [
              {
                index: true,
                element: Dashboard,
              },
              {
                path: "manage-bookings",
                children: [
                  {
                    index: true,
                    element: AdminManageBookings,
                  },
                  {
                    path: "booking-details/:bookingId",
                    element: AdminBookingDetails,
                  }
                ]
              },
              {
                path: "manage-users",
                children: [
                  {
                    index: true,
                    element: AdminManageUsers,
                  },
                  {
                    path: "user-details/:userId",
                    element: AdminUserDetails,
                  }
                ]
              },
              {
                path: "manage-partners",
                children: [
                  {
                    index: true,
                    element: AdminManagePartners,
                  },
                  {
                    path: "partner-details/:partnerId",
                    element: AdminPartnerDetails,
                  }
                ]
              },
              {
                path: "manage-hotels",
                children: [
                  {
                    index: true,
                    element: AdminManageHotels,
                  },
                  {
                    path: "hotel-details/:hotelId",
                    element: AdminHotelDetails,
                  }
                ]
              },
              {
                path: "manage-packages",
                children: [
                  {
                    index: true,
                    element: AdminManagePackages,
                  },
                  {
                    path: "package-details/:packageId",
                    element: AdminPackageDetails,
                  },
                  {
                    path: "package-create",
                    element: AdminPackageCreate,
                  },
                  {
                    path: "package-edit/:packageId",
                    element: AdminPackageEdit,
                  }
                ]
              },
              {
                path: "manage-conveniences",
                element: AdminManageConveniences,
              },
            ],
          },
          {
            path: "/partner",
            element: partner,
            children: [
              {
                index: true,
                element: ViewBooking,
              },
              {
                path: "manage-hotel",
                children: [
                  {
                    index: true,
                    element: ManageHotel,
                  },
                  {
                    path: "hotel-details/:hotelId",
                    element: PartnerHotelDetails,
                  }
                ]
              },
              {
                path: "manage-hotel/:id/edit",
                element: Edit
              },
              {
                path: "packet",
                element: Packet
              },
              {
                path: "manage-hotel/:id/manage-room/room-details/:id",
                element: RoomDetails
              },
              {
                path: "manage-hotel/:id/manage-room/:id/update",
                element: UpdateRoom
              },
              {
                path: "manage-hotel/:id/manage-room",
                element: Room
              },
              {
                path: "manage-hotel/:id/manage-room/create-room",
                element: CreateRoom
              },

              {
                path: "create-hotel",
                element: CreateHotel,
              },
            ]
          }
        ],
      },
    ]
  },
  {
    path: "*",
    element: errorPage,
  }

]);
