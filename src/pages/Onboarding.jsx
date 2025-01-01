import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const Onboarding = () => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate()
    const handleRoleSelection = async (role) => {
        await user.update({
            unsafeMetadata: {
                role
            }
        }).then(() => {
            navigate(role === "recruiter" ? "/post-job" : "/jobs")
        }).catch((err) => {
            console.log("Error", err)
        })
    }
    useEffect(() => {
        if (isLoaded && user?.unsafeMetadata?.role) {
            console.log("user", user);
            navigate(user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs");
        }
    }, [user])
    if (!isLoaded) {
        return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
    }
    return (

        <div className='mt-32 flex flex-col items-center justify-center'>
            <div>
                <h2 className='font-extrabold gradient-title text-7xl sm:text-8xl tracking-tighter'>I am a...</h2>
                <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
                    <Button onClick={async () => { await handleRoleSelection("candidate") }} className="bg-blue-500 hover:bg-blue-600 h-36 text-2xl">Candidate</Button>
                    <Button onClick={async () => { await handleRoleSelection("recruiter") }} variant="destructive" className="h-36 text-2xl">Recruiter</Button>
                </div>
            </div>
        </div>
    )
}

export default Onboarding