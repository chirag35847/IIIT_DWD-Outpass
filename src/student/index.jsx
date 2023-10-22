import { Button, FileInput, Modal, ScrollArea, Space, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useCallback, useEffect, useState } from 'react'
import {z} from 'zod'
import Select from 'react-select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';

const StudentMain = () => {
    const [studentData,setStudentData] = useState();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedGender,setSelectedGender] = useState();
    const [profileImageFile,setProfileImageFile] = useState();
    const [selectedBloodGroup,setSelectedBloodGroup] = useState();
    const genderOptions = [
        {value:'Male',label:"Male"},
        {value:'Female',label:"Female"},
        {value:'Other',label:"Other"},
    ]

    const bloodGroupOptions = [
        {value:"O+ve",label:"O+ve"},
        {value:"A+ve",label:"A+ve"},
        {value:"B+ve",label:"B+ve"},
        {value:"O-ve",label:"O-ve"},
        {value:"A-ve",label:"A-ve"},
        {value:"B-ve",label:"B-ve"},
        {value:"AB-ve",label:"AB-ve"},
        {value:"AB+ve",label:"AB+ve"},
        {value:"Rare Blood Types",label:"Rare Blood Types"},
    ]

    const schema = z.object({
        name:z.string().refine(val=>val.length>0,{message:"Name Cannot Be Empty"}),
        gender:z.string().refine(val=>val.length>0,{message:"Please select a gender"}),
        dob:z.string().refine(val=>val.length>0,{message:"DOB cannot be empty"}),
        phone:z.string().refine(val=>/[0-9+-]{10,15}$/.test(val),{message:"Please enter a valid phone"}),
        email:z.string().refine(val=>/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),{message:"Please enter a valid email"}),
        fathersName:z.string().refine(val=>val.length>0,{message:"FathersName cannot be empty"}),
        mothersName:z.string().refine(val=>val.length>0,{message:"MothersName cannot be empty"}),
        fathersEmail:z.string().refine(val=>/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),{message:"Please enter a valid email"}),
        fathersPhone:z.string().refine(val=>/[0-9+-]{10,15}$/.test(val),{message:"Please enter a valid phone number"}),
        mothersEmail:z.string().refine(val=>/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),{message:"Please enter a valid email"}),
        mothersPhone:z.string().refine(val=>/[0-9+-]{10,15}$/.test(val),{message:"Please enter a valid phone number"}),
        residentialAddress:z.string().refine(val=>val.length>0,{message:"residentialAddress cannot be empty"}),
        bloodGroup:z.string().refine(val=>val.length>0,{message:"bloodGroup cannot be empty"}),
    });
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

    const getStudentInformation = useCallback(() => {
        // API to return the student information

        // const data = undefined
        const data = {
            name : 'Chirag Mittal',
            gender : "Male",
            dob : '01/08/2002',         // In this case the API should return in format DD/MM/YYYY
            phone : "+91-8527288876",
            email : "20bds016@iiitdwd.ac.in",
            fathersName : "RamKumar Mittal",
            mothersName : "Sangeeta Mittal",
            fathersEmail : "ram801132@gmail.com",
            fathersPhone : "+91-8011325410",
            mothersEmail : "sangeeta@gmail.com",
            mothersPhone : "+91-7002341587",
            profileImage : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
            residentialAddress : "Somewhere On Earth, On Some Street, At Some House",
            bloodGroup : "O+ve",
            facultyAdvisorEmail : "professor@iiitdwd.ac.in",   // does not require ti be entered by student
            facultyAdvisorName : "Dr. Professor Prof",    // does not require ti be entered by student
            branch : "Data Science And AI",   // can get from email
            regNo : "20bds016"   // can get from email
        }

        setStudentData(data);
        if(data==undefined || data?.name==undefined){
            open()
        }
    },[selectedGender,profileImageFile])

    const handleSubmitData = useCallback((data)=>{
        console.log('--------');
        console.log(data);
        console.log(profileImageFile)

        // Do not touch anything else
        // Write the API to send the data here 
        // use data object and profileImageFile object


        setValue('gender',"");
        setValue('bloodGroup',"")
        reset()
    },[profileImageFile])

    useEffect(()=>{
        setValue('gender',"");
        setValue('bloodGroup',"")
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
            <Modal size={'xl'} className='rouneded-xl h-[80vh]' opened={opened} onClose={close} title="Add Information" closeOnClickOutside={false} withCloseButton={false}>
                <form id="addStudentDetailsForm" name='addStudentDetailsForm' onSubmit={handleSubmit((data)=>handleSubmitData(data))}>
                    <div className='flex flex-col p-4'>
                        <ScrollArea h={'60vh'}>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Name</label>
                                <TextInput placeholder='Enter Your Name' {...register('name')}/>
                                {errors?.name?.message && <small className='inline-block text-[#ff0000]'>{errors.name.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Gender</label>
                                <Select placeholder='Please Select Your Gender' options={genderOptions} value={selectedGender} onChange={(e)=>{setValue('gender',e.value),setSelectedGender(e)}}/>
                                {errors?.gender?.message && <small className='inline-block text-[#ff0000]'>{errors.gender.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Blood Group</label>
                                <Select placeholder='Select Your Blood Group' options={bloodGroupOptions} value={selectedBloodGroup} onChange={(e)=>{setSelectedBloodGroup(e),setValue('bloodGroup',e.value)}}/>
                                {errors?.bloodGroup?.message && <small className='inline-block text-[#ff0000]'>{errors.bloodGroup.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Date Of Birth</label>
                                <input type='date' className='border h-9 border-[#AEAEAE] p-2 rounded' placeholder='Enter Your DOB' {...register('dob')}/>
                                {errors?.dob?.message && <small className='inline-block text-[#ff0000]'>{errors.dob.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Phone Number</label>
                                <TextInput placeholder='Enter your phone number' {...register('phone')}/>
                                {errors?.phone?.message && <small className='inline-block text-[#ff0000]'>{errors.phone.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Email</label>
                                <TextInput placeholder='Enter Your Email' {...register('email')}/>
                                {errors?.email?.message && <small className='inline-block text-[#ff0000]'>{errors.email.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Father's Name</label>
                                <TextInput placeholder='Enter Your Fathers Name' {...register('fathersName')}/>
                                {errors?.fathersName?.message && <small className='inline-block text-[#ff0000]'>{errors.fathersName.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Mother's Name</label>
                                <TextInput placeholder='Enter Your Mothers Name' {...register('mothersName')}/>
                                {errors?.mothersName?.message && <small className='inline-block text-[#ff0000]'>{errors.mothersName.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Father's Email</label>
                                <TextInput placeholder='Enter Your Fathers Email' {...register('fathersEmail')}/>
                                {errors?.fathersEmail?.message && <small className='inline-block text-[#ff0000]'>{errors.fathersEmail.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Father's Phone</label>
                                <TextInput placeholder='Enter Your Fathers Phone' {...register('fathersPhone')}/>
                                {errors?.fathersPhone?.message && <small className='inline-block text-[#ff0000]'>{errors.fathersPhone.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Mother's Email</label>
                                <TextInput placeholder='Enter Your Mothers Email' {...register('mothersEmail')}/>
                                {errors?.mothersEmail?.message && <small className='inline-block text-[#ff0000]'>{errors.mothersEmail.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Mother's Phone</label>
                                <TextInput placeholder='Enter Your Mothers Phone' {...register('mothersPhone')}/>
                                {errors?.mothersPhone?.message && <small className='inline-block text-[#ff0000]'>{errors.mothersPhone.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Profile Photo</label>
                                <FileInput accept="image/png,image/jpeg" placeholder='Select A Profile photo for yourself' onChange={setProfileImageFile}/>
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Residential Addresses</label>
                                <TextInput placeholder='Enter Your Residential Addresses' {...register('residentialAddress')}/>
                                {errors?.residentialAddress?.message && <small className='inline-block text-[#ff0000]'>{errors.residentialAddress.message}</small>}
                            </div>
                        </ScrollArea>
                        <div className='flex justify-end w-[100%] mt-5'>
                        <input type="submit" className="bg-[#5C5CFF] w-full inline-block text-center p-2 text-[#fff] border border-solid border-[#43B28A] rounded-xl" value={"Add Profile"} />
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default StudentMain