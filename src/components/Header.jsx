import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { BriefcaseBusinessIcon, Heart, PenBox } from 'lucide-react';

const Header = () => {
    const { user, isLoaded } = useUser();
    const [showSignIn, setShowSignIn] = useState(false)
    const [search, setSearch] = useSearchParams();
    useEffect(() => {
        if (search.get('sign-in')) {
            setShowSignIn(true)
        }
    }, [search])
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowSignIn(false)
            setSearch({});
        }

    }
    return (
        <>
            <nav className='flex items-center mt-2 justify-between'>
                <Link to="/">
                    <img src="/logo.png" className='h-20' alt="" />
                </Link>
                <div className='flex gap-8'>
                    <SignedOut>
                        <Button onClick={() => { setShowSignIn(true) }} variant="outline">Login</Button>
                    </SignedOut>
                    <SignedIn>
                        {
                            user?.unsafeMetadata?.role === "recruiter" &&
                            <Link to="/post-job">
                                <Button variant="destructive" className="rounded-full">
                                    <PenBox size={20} className='mr-2' />
                                    Post Job
                                </Button>
                            </Link>
                        }
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-10 h-10"
                            }
                        }}>
                            <UserButton.MenuItems >
                                <UserButton.Link label="My Jobs" labelIcon={<BriefcaseBusinessIcon size={15} />} href="/my-jobs" />
                            </UserButton.MenuItems>
                            <UserButton.MenuItems >
                                <UserButton.Link label="Saved Jobs" labelIcon={<Heart size={15} />} href="/saved-jobs" />
                            </UserButton.MenuItems>
                        </UserButton>
                    </SignedIn>
                </div>
                {
                    showSignIn && <div onClick={handleOverlayClick} className='fixed top-0 left-0 inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                        <SignIn
                            signUpForceRedirectUrl="/onboarding"
                            fallbackeRedirectUrl="/onboarding"
                        />
                    </div>
                }
            </nav>

        </>
    )
}

export default Header