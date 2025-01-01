import { getSingleJob, updateHiringStatus } from '@/api/apiJobs'
import { useFetch } from '@/hook/use-fetch'
import { useUser } from '@clerk/clerk-react'
import MDEditor from '@uiw/react-md-editor'
import { Briefcase, BriefcaseIcon, DoorClosed, DoorOpen, MapPin, MapPinIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ApplyJob from '@/components/ApplyJob'
import ApplicationCard from '@/components/ApplicationCard'

const JobPage = () => {
    const { isLoaded, user } = useUser()
    const { id } = useParams()
    const {
        loading: loadingJob,
        data: job,
        fn: fnGetJob,
    } = useFetch(getSingleJob, { jobId: id });
    const {
        loading: loadingupdateStatus,
        data: updatedStatusJob,
        fn: fnUpdateStatus,
    } = useFetch(updateHiringStatus, { jobId: id });
    const handleUpdateStatus = async (value) => {
        const isOpen = value === "open"
        await fnUpdateStatus(isOpen).then(async () => { await fnGetJob() })
    }
    useEffect(() => {
        if (isLoaded)
            fnGetJob();
    }, [isLoaded])
    if (!isLoaded || loadingJob) {
        return <BarLoader className='mb-4 container mt-4' width={"100%"} color='#36d7b7' />
    }
    return (
        <div className='container flex flex-col gap-8 mt-5'>
            <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
                <h1 className='gradient-text font-extrabold pb-3 text-4xl sm:text-6xl'> {job?.title}</h1>
                <img src={job?.company?.logo_url} className='h-12' alt="" />
            </div>
            <div className='flex justify-between'>
                <div className='flex gap-2 items-center'>
                    <MapPinIcon />
                    {job.location}
                </div>
                <div className='flex gap-2'>
                    <BriefcaseIcon /> {job?.applicants?.length} Applicants
                </div>
                <div className='flex gap-2'>
                    {job?.isOpen ? <><DoorOpen />Open</> : <><DoorClosed />Closed</>}
                </div>
            </div>

            {job.recruiter_id === user.id && (
                <div>
                    <Select onValueChange={handleUpdateStatus}>
                        <SelectTrigger className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
                            <SelectValue placeholder={"Hirring Status " + (job?.isOpen ? "( Open )" : "( Closed )")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
                <p className="sm:text-lg">{job?.description}</p>

                <h2 className="text-2xl sm:text-3xl font-bold">
                    What we are looking for
                </h2>
                <MDEditor.Markdown source={job?.requirements} className="bg-transparent sm:text-lg" />


                {/* rander Applicants */}
            </div>
            {job.recruiter_id !== user?.id && <ApplyJob
                job={job}
                user={user}
                fnJob={fnGetJob}
                applied={job?.applicants?.find((ap) => ap.candidate_id === user.id)}
            />}

            {
                job?.applicants?.length > 0 && job?.recruiter_id === user?.id && (
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
                        {job?.applicants.map((application) => {
                            return (
                                <ApplicationCard key={application.id} application={application} />
                            );
                        })}
                    </div>
                )
            }
        </div>
    )
}

export default JobPage