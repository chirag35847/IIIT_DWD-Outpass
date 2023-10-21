import { Modal, Space, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useCallback, useEffect, useState } from 'react'
import {z} from 'zod'
import Select from 'react-select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';

const StudentMain = () => {
    const [studentData,setStudentData] = useState();
    const [opened, { open, close }] = useDisclosure(false);

    const schema = z.object({
        name:z.string().refine(val=>val.length>0,{message:"Name Cannot Be Empty"}),
        gender:z.string().refine(val=>val.length>0,{message:"Please select a gender"}),
        dob:z.string().refine(val=>val.length>0,{message:"DOB cannot be empty"}),
        phone:z.string().refine(val=>val.length>0,{message:"Phone cannot be empty"}),
        email:z.string().refine(val=>val.length>0,{message:"Email cannot be empty"}),
        fathersName:z.string().refine(val=>val.length>0,{message:"FathersName cannot be empty"}),
        mothersName:z.string().refine(val=>val.length>0,{message:"MothersName cannot be empty"}),
        fathersEmail:z.string().refine(val=>val.length>0,{message:"FathersEmail cannot be empty"}),
        fathersPhone:z.string().refine(val=>val.length>0,{message:"fathersPhone cannot be empty"}),
        mothersEmail:z.string().refine(val=>val.length>0,{message:"mothersEmail cannot be empty"}),
        mothersPhone:z.string().refine(val=>val.length>0,{message:"mothersPhone cannot be empty"}),
        profileImage:z.string().refine(val=>val.length>0,{message:"profileImage cannot be empty"}),
        residentialAddress:z.string().refine(val=>val.length>0,{message:"residentialAddress cannot be empty"}),
        bloodGroup:z.string().refine(val=>val.length>0,{message:"bloodGroup cannot be empty"}),
        facultyAdvisorEmail:z.string().refine(val=>val.length>0,{message:"facultyAdvisorEmail cannot be empty"}),
        facultyAdvisorName:z.string().refine(val=>val.length>0,{message:"facultyAdvisorName cannot be empty"}),
        branch:z.string().refine(val=>val.length>0,{message:"branch cannot be empty"}),
        regNo:z.string().refine(val=>val.length>0,{message:"regNo cannot be empty"}),
    });
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

    const getStudentInformation = useCallback(() => {
        // API to return the student information

        const data = undefined
        // const data = {
            // name : 'Chirag Mittal',
            // gender : "Male",
            // dob : new Date('01/08/2002'),         // In this case the API should return in format DD/MM/YYYY
            // phone : "+91-8527288876",
            // email : "20bds016@iiitdwd.ac.in",
            // fathersName : "RamKumar Mittal",
            // mothersName : "Sangeeta Mittal",
            // fathersEmail : "ram801132@gmail.com",
            // fathersPhone : "+91-8011325410",
            // mothersEmail : "sangeeta@gmail.com",
            // mothersPhone : "+91-7002341587",
            // profileImage : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
            // residentialAddress : "Somewhere On Earth, On Some Street, At Some House",
            // bloodGroup : "O+ve",
            // facultyAdvisorEmail : "professor@iiitdwd.ac.in",
            // facultyAdvisorName : "Dr. Professor Prof",
            // branch : "Data Science And AI",
            // regNo : "20bds016"
        // }

        setStudentData(data);
        if(data==undefined || data?.name==undefined){
            console.log('exe');
            open()
            console.log(opened)
        }
    },[])

    useEffect(()=>{
        getStudentInformation();
    },[])

    return (
        <>
            <div className='w-[100vw] flex flex-col items-center'>  
                <div className='w-[95vw] h-[8vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[3vh] rounded-xl flex justify-center items-center'>
                    <h2 className='text-[1.8rem] text-[#fff] font-medium'>{`Welcome, ${studentData?.name}`}</h2>
                </div>
                <div className='w-[95vw] h-[24vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[2.2vh] rounded-xl p-4'>
                    <h2 className='text-[1rem] text-[#fff] font-medium'>Your Information</h2>

                </div>
                <div className='w-[95vw] h-[24vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[2.2vh] rounded-xl p-4'>
                    <h2 className='text-[1rem] text-[#fff] font-medium'>Active Outpass</h2>
                </div>
                <div className='w-[95vw] h-[32.4vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[2.2vh] rounded-xl p-4'>
                    <h2 className='text-[1rem] text-[#fff] font-medium'>Active Outpass</h2>
                </div>
            </div>
            <Modal size={'xl'} className='rouneded-xl h-[80vh]' opened={opened} onClose={close} title="Add Information">
                <form id="addStudentDetailsForm" name='addStudentDetailsForm' onSubmit={handleSubmit((e)=>{handleSendData(e)})}>
                    <div className='flex flex-col'>
                        <TextInput placeholder='Enter Your Name'/>
                        <Select placeholder='Please Select Your Gender'/>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default StudentMain