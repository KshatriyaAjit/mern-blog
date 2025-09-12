import {  RouteSignin } from '@/helpers/RouteName';

import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AuthRouteProtection = () => {
     const { user, token,isLoggedIn } = useSelector((state) => state.auth);
    if (user && isLoggedIn) {
        return (
            <Outlet />
        )
    } else {
        return <Navigate to={RouteSignin} />
    }

}

export default AuthRouteProtection