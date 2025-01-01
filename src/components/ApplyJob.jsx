import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFetch } from '@/hook/use-fetch'
import { applyToJobs } from "@/api/apiApplications";
import { BarLoader } from 'react-spinners'

const schema = z.object({
    experience: z
        .number()
        .min(0, { message: "Experience must be at least 0" })
        .int(),
    skills: z.string().min(1, { message: "Skills are required" }),
    education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
        message: "Education is required",
    }),
    resume: z
        .any()
    // .refine(
    //     (file) =>
    //         file[0] &&
    //         (file[0].type === "application/pdf" ||
    //             file[0].type === "application/msword"),
    //     { message: "Only PDF or Word documents are allowed" }
    // ),
});

const ApplyJob = ({ user, job, fnJob, applied = false }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
    });

    const {
        loading: loadingApply,
        error: errorApply,
        fn: fnApply,
    } = useFetch(applyToJobs);
    const onSubmit = async (data) => {
        const { experience, skills, education } = data
        const jobData = {
            experience,
            skills,
            education,
            job_id: job.id,
            candidate_id: user.id,
            name: user.fullName,
            status: "applied",
            resume: data.resume[0],
        }
        const rrr = await fnApply([jobData])
            .then(async () => {
                await fnJob();
                reset();
            });
    };

    return (
        <Drawer open={applied ? false : undefined}>
            <DrawerTrigger>
                <Button className={`${job?.isOpen && !applied && "bg-blue-600 hover:bg-blue-700 text-white"}`} variant={job?.isOpen && !applied ? "" : "destructive"}
                    disabled={!job?.isOpen || applied}
                    size={"lg"}
                >
                    {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hirring Closed"}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Apply for {job?.title} in {job?.company?.name}</DrawerTitle>
                    <DrawerDescription>Please Fill The Form Below.</DrawerDescription>
                </DrawerHeader>
                <form className='flex flex-col gap-4 p-4 pb-0' onSubmit={handleSubmit(onSubmit)}>
                    <Input type="number" placeholder="Years of experience"
                        className="flex-1"
                        {...register("experience", {
                            valueAsNumber: true,
                        })}
                    />
                    {errors.experience && (
                        <p className="text-red-500">{errors.experience.message}</p>
                    )}
                    <Input type="text" placeholder="Skills (comma seperated)"
                        className="flex-1"
                        {...register("skills")}
                    />
                    {errors.skills && (
                        <p className="text-red-500">{errors.skills.message}</p>
                    )}
                    <Controller
                        name="education"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} {...field}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Intermediate" id="intermediate" />
                                    <Label htmlFor="intermediate">Intermediate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Graduate" id="graduate" />
                                    <Label htmlFor="graduate">Graduate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Post Graduate" id="postgraduate" />
                                    <Label htmlFor="graduate">Post Graduate</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                    {errors.education && (
                        <p className="text-red-500">{errors.education.message}</p>
                    )}
                    <Input type="file"
                        {...register("resume")}
                        appcept=".pdf .doc .docx"
                        className="flex-1 file:text-blue-600"
                    />
                    {errors.resume && (
                        <p className="text-red-500">{errors.resume.message}</p>
                    )}
                    {errorApply?.message && (
                        <p className="text-red-500">{errorApply?.message}</p>
                    )}
                    {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Submit</Button>
                </form>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    )
}

export default ApplyJob