import { RouteIndex, RouteSignin } from '@/helpers/RouteName'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const OnlyAdminAllowed = () => {
    const { user, token, isLoggedIn } = useSelector((state) => state.auth);
    if (user && isLoggedIn && user.role === 'admin') {
        return (
            <Outlet />
        )
    } else {
        return <Navigate to={RouteSignin} />
    }

}

export default OnlyAdminAllowed