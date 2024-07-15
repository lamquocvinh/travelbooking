import React from 'react';
import "./Dashboard.scss";
import Users from './Components/Users';
import Partners from './Components/Partners';
import Hotels from './Components/Hotels';
import Bookings from './Components/Bookings';
import Packages from './Components/Packages';

const Dashboard = () => {
    return (
        <div className='admin-dashboard-wrapper'>
            <div className='stats'>
                <Users />
                <Partners />
                <Hotels />
                <Bookings />
            </div>
            <Packages />
        </div>
    )
}

export default Dashboard