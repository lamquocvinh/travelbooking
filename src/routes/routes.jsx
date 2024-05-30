import { createBrowserRouter } from "react-router-dom";
import Loadable from "./Loadable";
import MainLayout from "../layout/MainLayout";
import AuthGuard from "./AuthGuard";
const Login = Loadable({ loader: () => import("../pages/login/Login") });
const Home = Loadable({ loader: () => import("../pages/home/Home") });
const errorPage = Loadable({ loader: () => import("../pages/error/Error") });
const RoomDetailsPage = Loadable({ loader: () => import("../pages/roomDetailsPage") });
const HotelList = Loadable({ loader: () => import("../pages/hotellist/HotelList") });
const HotelDetail = Loadable({ loader: () => import("../pages/roomLisst/HotelDetail") });
const RegisterPage = Loadable({ loader: () => import("../pages/registerPage") });

const Dashboard = Loadable({
  loader: () => import("../pages/dashboard/Dashboard"),
});
const Admin = Loadable({
  loader: () => import("../pages/admin/Admin"),
});
export const router = createBrowserRouter([

  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <AuthGuard />,
        children: [
          {
            children: [
              {
                index: true,
                element: Dashboard,
              },
              {
                path: "home",
                element: Home,
              },
              {
                path: "admin",
                element: Admin,
              },

            ],
          },

        ],

      },
      {
        path: "/hotel-list",
        element: HotelList,
      },
      {
        path: "/hotel-detail/:hotelId",
        element: HotelDetail,
      },
      {
        path: "/room-details/:1",
        element: RoomDetailsPage,
      },
      {
        path: "/register",
        element: RegisterPage,
      },
      {
        path: "/login",
        element: Login,
      },
      ////////////// add for more no login
    ]
  },
  {
    path: "*",
    element: errorPage,
  }

]);
