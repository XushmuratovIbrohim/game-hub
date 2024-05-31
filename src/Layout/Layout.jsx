import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import BottomNavigation from '../components/bottomNavigation/SimpleBottomNavigation'
export default function Layout() {
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/auth/login')
        }
    })
    return (
        <div>
            <Outlet />
            <BottomNavigation />
        </div>
    )
}
