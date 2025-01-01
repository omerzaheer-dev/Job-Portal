import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useFetch } from '@/hook/use-fetch'
import { saveJob } from '@/api/apiJobs'
import { useUser } from "@clerk/clerk-react";
import { deleteJob } from '@/api/apiJobs'

const JobCard = ({ job, isMyJob = false, savedInitVal = true, onJobSave = () => { } }) => {
    const [saved, setSaved] = useState(savedInitVal)
    const { user } = useUser();
    const {
        loading,
        data: savedJob,
        fn: fnSavedJob,
    } = useFetch(saveJob, { alreadySaved: saved });
    const {
        loadingDeleteJob,
        data: DeletedJobJob,
        fn: fnDeleteJon,
    } = useFetch(deleteJob, { job_id: job.id });

    const handleSaveJob = async () => {
        await fnSavedJob({
            user_id: user.id,
            job_id: job.id,
        });
        setSaved((prev) => !prev);
        onJobSave();
    };
    // useEffect(() => {
    //     if (savedJob !== undefined) setSaved(savedJob.length > 0)
    // }, [saveJob])
    const handleDeleteJob = async () => {
        await fnDeleteJon()
            .then(async () => {
                console.log("deleted");
                onJobSave();

            })
    }

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex justify-between items-center font-bold">{job.title}
                    {
                        isMyJob && (
                            <Trash2Icon
                                onClick={handleDeleteJob}
                                fill='red'
                                size={18}
                                className='text-red-300 cursor-pointer'
                            />
                        )
                    }
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
                <div className='flex items-center justify-between' >
                    {
                        job.company && (
                            <img src={job.company.logo_url} className='h-6' alt="" />
                        )
                    }
                    <div className='flex items-center gap-2'>
                        <MapPinIcon size={15} /> {job.location}
                    </div>
                </div>
                <hr />
                <div>
                    {job?.description.substring(0, 146)}...
                </div>
            </CardContent>
            <CardFooter className="flex gap-2 items-center">
                <Link to={`/job/${job.id}`} className='flex-1'>
                    <Button variant="secondary" className="w-full">
                        More Details
                    </Button>
                </Link>
                {
                    !isMyJob && (
                        <Button className="w-15" onClick={() => {
                            handleSaveJob()
                        }} disabled={loading} variant="outline">
                            {
                                saved ?
                                    <Heart size={20} stroke='red' fill='red' /> :
                                    <Heart size={20} />
                            }
                        </Button>
                    )
                }

            </CardFooter>
        </Card>
    )
}

export default JobCard