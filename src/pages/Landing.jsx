import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import companies from "@/data/companies.json"
import faqs from "@/data/faq.json"
const Landing = () => {
    return (
        <main className='flex flex-col items-center gap-10 md:gap-20 py-10 sm:py-20'>
            <section className='text-center'>
                <h1 className='flex flex-col items-center justify-center gradient-text text-4xl sm:text-6xl py-4 lg:text-8xl tracking-tighter  font-extrabold'>Get You'r Dream Job {" "} <span className='flex items-center justify-center'>And Get {"    "} <img src="/logo.png" className='h-14 ml-3 sm:h-24 lg:h-32' alt="" /></span></h1>
                <p className='text-grey-300 text-xs sm:text-lg mt-4'>Explore thousands of job listings or find a perfect candidate</p>
            </section>
            <div className='flex gap-6 justify-center items-center'>
                <Link to="/jobs">
                    <Button className="bg-blue-500 hover:bg-blue-600 h-14 sm:h-16 rounded-md px-14 text-lg sm:text-xl font-bold">Explore Jobs</Button>
                </Link>
                <Link to="/post-job">
                    <Button variant="destructive" className=" h-14 sm:h-16 rounded-md px-14 text-lg sm:text-xl font-bold">Post a Job</Button>
                </Link>
            </div>
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 2000,
                    }),
                ]}
                className="w-full py-10"
            >
                <CarouselContent>
                    {companies.map(({ name, id, path }, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                <img src={path} className='h-9 sm:h-14 object-contain' alt="" />
                            </CardContent>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            {/* banner */}
            <img src="/banner.jpeg" className='w-full px-4' alt="" />
            <section className=' w-full px-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>For Job Seakers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Search and apply for jobs, track applications and more</p>
                    </CardContent>
                </Card>
                <Card >
                    <CardHeader>
                        <CardTitle>For Employers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Post Jobs manage appications, and find the best candidates</p>
                    </CardContent>
                </Card>
            </section>
            <section className='w-full px-5'>
                {
                    faqs.map((item, index) => {
                        return <Accordion type="single" collapsible>
                            <AccordionItem value={index + 1}>
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    })
                }
            </section>

        </main>
    )
}

export default Landing