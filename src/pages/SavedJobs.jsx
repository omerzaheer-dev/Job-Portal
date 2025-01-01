import React, { useEffect } from 'react'
import { getSvedJobs } from '@/api/apiJobs'
import { useFetch } from '@/hook/use-fetch'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import JobCard from '@/components/JobCard'
const SavedJobs = () => {
    const { user, isLoaded } = useUser()
    const { data: savedJobs, loading: loadingSavedJobs, error: errorSavedJobs, fn: fetchSavedJobs } = useFetch(getSvedJobs)
    useEffect(() => {
        if (isLoaded) {
            fetchSavedJobs()
        }
    }, [isLoaded])
    if (!isLoaded || loadingSavedJobs) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }
    return (
        <div>
            <h1 className="gradient-text font-extrabold text-6xl sm:text-7xl text-center pb-8">
                Saved Jobs
            </h1>

            {loadingSavedJobs === false && (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedJobs?.length ? (
                        savedJobs?.map((saved) => {
                            return (
                                <JobCard
                                    key={saved.id}
                                    job={saved?.job}
                                    onJobAction={fetchSavedJobs}
                                    savedInit={true}
                                />
                            );
                        })
                    ) : (
                        <div>No Saved Jobs 👀</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SavedJobs