import React from 'react'
import { Outlet } from 'react-router-dom'
import "../App.css"
import Header from '@/components/Header'
const AppLayout = () => {
    return (
        <>
            <div className='grid-background'></div>
            <main className='min-h-screen mx-auto container'>
                <Header />
                <Outlet />
            </main>
            <footer className='p-10 bg-grey-800 text-center mt-10'>
                Made by Umar Zaheer
            </footer>
        </>
    )
}

export default AppLayout