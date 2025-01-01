import React, { useEffect, useState } from 'react';
import JobCard from '@/components/JobCard';
import { getJobs } from '@/api/apiJobs';
import { useUser } from "@clerk/clerk-react";
import { useFetch } from '@/hook/use-fetch';
import { BarLoader } from 'react-spinners';
import { getCompanies } from '@/api/apiCompany';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { State } from 'country-state-city';
const JobListing = () => {
    const { isLoaded } = useUser()
    const [searchQuery, setSearchQuery] = useState("")
    const [location, setLocation] = useState("")
    const [companyId, setCompanyId] = useState("")
    const { fn: fetchJobs, data: jobs, error, loading } = useFetch(getJobs, { location, searchQuery, companyId })
    const {
        data: companies,
        fn: fnGetCompanies,
    } = useFetch(getCompanies);
    useEffect(() => {
        if (isLoaded) {
            fnGetCompanies();

        }
    }, [isLoaded]);
    const clearFilters = () => {
        setSearchQuery("");
        setLocation("");
        setCompanyId("");
    }
    const handleSearch = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        const query = formData.get("search-query")
        if (query) {
            setSearchQuery(query)
        }
    }
    useEffect(() => {
        if (isLoaded) fetchJobs();
    }, [isLoaded, searchQuery, location, companyId])
    return (
        <div className="job-listing container px-4">
            <h1 className='gradient-text font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>
            <form onSubmit={handleSearch} className='w-full flex h-14 gap-2 mb-3 items-center'>
                <Input type="text" placeholder="Search Jobs By Title..."
                    name="search-query"
                    className="h-full flex-1 px-4 text-md"
                />
                <Button type="submit" className="h-full sm:w-28 bg-blue-500 hover:bg-blue-600" >Search</Button>
            </form>
            <div className='flex flex-col sm:flex-row gap-2'>
                <Select value={location} onValueChange={(value) => setLocation(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter By Location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {State.getStatesOfCountry("IN").map(({ name }) =>
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select value={companyId} onValueChange={(value) => setCompanyId(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter By Company" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {companies.map(({ name, id }) =>
                                <SelectItem key={name} value={id}>{name}</SelectItem>
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button onClick={clearFilters} variant="destructive" className="sm:w-1/2">Clear Filters</Button>
            </div>
            {
                loading && <BarLoader className='mb-4 container mt-4' width={"100%"} color='#36d7b7' />
            }
            {
                loading === false && (jobs?.length ? <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {
                        jobs?.map(job => {
                            return (
                                <JobCard key={job?.id} job={job} savedInitVal={job?.saved?.length > 0} />
                            )
                        })
                    }
                </div> :
                    <div>
                        No jobs
                    </div>)
            }
        </div>
    )
}

export default JobListing