import AppSidebar from '@/components/AppSidebar'
import Footer from '@/components/Footer'
import Topbar from '@/components/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (

        <SidebarProvider>
            <Topbar />
            <div className="hidden sm:block fixed left-0 top-16 h-[calc(100%-4rem)] w-64 border-r bg-white dark:bg-gray-900 shadow-md z-30">
    <AppSidebar />
  </div>
           
            <main className=' sm:ml-64 w-full'>
                <div className='w-full min-h-[calc(100vh-45px)] pt-20 pb-8 px-3 sm:px-6 lg:px-10'>
                    <Outlet />
                </div>
                <Footer />
            </main>
        </SidebarProvider>
    )
}

export default Layout


