import { addNewJob } from '@/api/apiJobs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFetch } from '@/hook/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { State } from 'country-state-city';
import { z } from 'zod';
import { getCompanies } from '@/api/apiCompany';
import { Navigate, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { BarLoader } from 'react-spinners';
import AddCompanyDrawer from '@/components/AddCompanyDrawer';
const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    location: z.string().min(1, { message: "Select a location" }),
    company_id: z.string().min(1, { message: "Select or Add a new Company" }),
    requirements: z.string().min(1, { message: "Requirements are required" }),
});
const PostJobs = () => {
    const { user, isLoaded } = useUser();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: { location: "", company_id: "", requirements: "" },
        resolver: zodResolver(schema),
    });
    const {
        loading: loadingCreateJob,
        error: errorCreateJob,
        data: dataCreateJob,
        fn: fnCreateJob,
    } = useFetch(addNewJob);
    const {
        data: companies,
        fn: fnGetCompanies,
    } = useFetch(getCompanies);
    useEffect(() => {
        if (isLoaded) {
            fnGetCompanies();

        }
    }, [isLoaded]);
    const navigate = useNavigate()
    useEffect(() => {
        if (dataCreateJob?.length > 0) navigate("/jobs");
    }, [loadingCreateJob]);
    const onSubmit = (data) => {
        fnCreateJob({
            ...data,
            recruiter_id: user.id,
            isOpen: true,
        });
    };
    if (user?.unsafeMetadata?.role !== "recruiter") {
        return <Navigate to="/jobs" />;
    }
    return (
        <div>
            <h1 className="gradient-text font-extrabold text-5xl sm:text-7xl text-center pb-8">
                Post a Job
            </h1>
            <form className="flex flex-col gap-4 p-4 pb-0" onSubmit={handleSubmit(onSubmit)} action="">
                <Input placeholder="Job Title" {...register("title")} />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                <Textarea placeholder="Job Description" {...register("description")} />
                {errors.description && (
                    <p className="text-red-500">{errors.description.message}</p>
                )}
                <div className="flex gap-4 items-center">
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Job Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {State.getStatesOfCountry("IN").map(({ name }) => (
                                            <SelectItem key={name} value={name}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <Controller
                        name="company_id"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Company">
                                        {field.value
                                            ? companies?.find((com) => com.id === Number(field.value))
                                                ?.name
                                            : "Company"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {companies?.map(({ name, id }) => (
                                            <SelectItem key={name} value={id}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <AddCompanyDrawer fetchCompanies={fnGetCompanies} />
                </div>
                {errors.location && (
                    <p className="text-red-500">{errors.location.message}</p>
                )}
                {errors.company_id && (
                    <p className="text-red-500">{errors.company_id.message}</p>
                )}

                <Controller
                    name="requirements"
                    control={control}
                    render={({ field }) => (
                        <MDEditor value={field.value} onChange={field.onChange} />
                    )}
                />
                {errors.requirements && (
                    <p className="text-red-500">{errors.requirements.message}</p>
                )}
                {errors.errorCreateJob && (
                    <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
                )}
                {errorCreateJob?.message && (
                    <p className="text-red-500">{errorCreateJob?.message}</p>
                )}
                {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
                <Button type="submit" variant="blue" size="lg" className="mt-2">
                    Submit
                </Button>
            </form>
        </div>
    )
}

export default PostJobs