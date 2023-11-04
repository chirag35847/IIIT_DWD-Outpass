import { useDisclosure } from '@mantine/hooks';
import React, { useCallback, useEffect, useState } from 'react'
import { z } from 'zod';
import Select from 'react-select'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Button, FileInput, Modal, ScrollArea, Text, TextInput } from '@mantine/core';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import PendingRequestModal from './pendingRequestModal';

const FacultMain = () => {
    const [facultyData, setFacultyData] = useState();
    const [selectedRole, setSelectedRole] = useState();
    const [selectedPhoto, setSelectedPhoto] = useState();
    const [grantedRequests, setGrantedRequests] = useState([]);
    const [rejectedRequests, setRejectedRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [mentees, setMentees] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);
    const facultyOptions = [
        { value: "SWC", label: "SWC" },
        { value: "Warden", label: "Warden" }
    ]

    const schema = z.object({
        name: z.string().refine(val => val.length > 0, { message: "Name Cannot Be Empty" }),
    })
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

    const fetchFacultyData = useCallback(() => {
        // const data = undefined;
        const data = {
            role: "SWC",
            email: "faculty@iiitdwd.ac.in",
            name: "Mr. Something something",
            profilePhoto: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        }

        setFacultyData(data);

        if (data == undefined) {
            open();
            console.log(opened)
        }
    }, [])

    const fetchOutPassRequests = useCallback(() => {
        // get 3 lists for this faculty
        const granted = [
            {
                id: "1",
                regNo: '20BDS016',
                from: '01/08/2023',
                to: '10/08/2023',
            },
            {
                id: "2",
                regNo: '20BDS016',
                from: '01/08/2023',
                to: '10/08/2023',
            }
        ]

        const pending = [
            {
                id: "1",
                regNo: '20BDS016',
                from: '01/08/2023',
                to: '10/08/2023',
            },
            {
                id: "2",
                regNo: '20BDS016',
                from: '01/08/2023',
                to: '10/08/2023',
            }
        ]

        const rejected = [
            {
                id: "1",
                regNo: '20BDS016',
                from: '01/08/2023',
                to: '10/08/2023',
            },
            {
                id: "2",
                regNo: '20BDS016',
                from: '01/08/2023',
                to: '10/08/2023',
            },
            {
                id: "1",
                regNo: '20BDS016',
                from: '01/08/2023',
                to: '10/08/2023',
            },
            {
                id: "2",
                regNo: '20BDS016',
                from: '01/08/2023',
                to: '10/08/2023',
            }
        ]

        setGrantedRequests(granted);
        setPendingRequests(pending);
        setRejectedRequests(rejected);
    }, [])

    const fetchMenteeList = useCallback(() => {
        const list = [
            {
                id: '1',
                name: "Student 1",
                regNo: "ABCXYZWBC",
            },
            {
                id: '2',
                name: "Student 1",
                regNo: "ABCXYZWBC",
            },
            {
                id: '3',
                name: "Student 1",
                regNo: "ABCXYZWBC",
            },
            {
                id: '4',
                name: "Student 1",
                regNo: "ABCXYZWBC",
            },
            {
                id: '1',
                name: "Student 1",
                regNo: "ABCXYZWBC",
            },
            {
                id: '2',
                name: "Student 1",
                regNo: "ABCXYZWBC",
            },
            {
                id: '3',
                name: "Student 1",
                regNo: "ABCXYZWBC",
            },
            {
                id: '4',
                name: "Student 1",
                regNo: "ABCXYZWBC",
            },
        ]

        setMentees(list);
    }, [])

    const handleAddInformation = useCallback((data) => {
        // use data, selectedRole,selectedPhoto for saving data

        console.log(data);
        console.log(selectedPhoto)
        console.log(selectedRole)

        reset();
        setSelectedRole();
        setSelectedPhoto();
    }, [selectedRole, selectedPhoto])

    useEffect(() => {
        fetchFacultyData()
        fetchOutPassRequests()
        fetchMenteeList()
    }, [])

    return (
        <>
            <div className='w-[100vw] flex flex-col items-center'>
                <div className='w-[95vw] h-[8vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[3vh] rounded-xl flex justify-center items-center'>
                    <h2 className='text-[1.8rem] text-[#fff] font-medium'>{`Welcome, ${facultyData?.name}`}</h2>
                </div>
                <div className='flex flex-col w-[95vw] h-[24vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[2.2vh] rounded-xl p-4'>
                    <div className='flex justify-between'>
                        <h2 className='text-[1rem] text-[#fff] font-medium'>Your Information</h2>
                        <Button rightIcon={<IconEdit size={14} />}>Edit</Button>
                    </div>
                    <div className='flex h-[20vh] justify-around'>
                        <Avatar size={150} radius={'100%'} src={facultyData?.profilePhoto} alt="it's me" />
                        <div className='flex flex-col w-[50%]'>
                            {
                                facultyData?.name &&
                                <div className='rounded-xl p-2 bg-[#fff]/[.50] flex justify-between mb-3'>
                                    <div className='w-[20%]'>
                                        <Text size={15}>{'Name'}</Text>
                                    </div>
                                    <div className='w-[20%]'>
                                        <Text size={15}>:</Text>
                                    </div>
                                    <div className='w-[60%]'>
                                        <Text size={15}>{facultyData?.name}</Text>
                                    </div>
                                </div>
                            }
                            {
                                facultyData?.role &&
                                <div className='rounded-xl p-2 bg-[#fff]/[.50] flex justify-between mb-3'>
                                    <div className='w-[20%]'>
                                        <Text size={15}>{'Role'}</Text>
                                    </div>
                                    <div className='w-[20%]'>
                                        <Text size={15}>:</Text>
                                    </div>
                                    <div className='w-[60%]'>
                                        <Text size={15}>{facultyData?.role}</Text>
                                    </div>
                                </div>
                            }
                            {
                                facultyData?.email &&
                                <div className='rounded-xl p-2 bg-[#fff]/[.50] flex justify-between mb-3'>
                                    <div className='w-[20%]'>
                                        <Text size={15}>{'Email'}</Text>
                                    </div>
                                    <div className='w-[20%]'>
                                        <Text size={15}>:</Text>
                                    </div>
                                    <div className='w-[60%]'>
                                        <Text size={15}>{facultyData?.email}</Text>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className='flex justify-evenly w-[95vw] h-[24vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[2.2vh] rounded-xl p-4'>
                    <div className='w-[32%] h-auto bg-[#fff]/[.50] rounded-xl'>
                        <div className='flex flex-col justify-between'>
                            <Text className='text-[1rem] text-black font-medium p-2'>Pending Requests</Text>
                            <ScrollArea w={'auto'} h={'15vh'}>
                                {
                                    pendingRequests.map((x, i) => {
                                        return (
                                            <div key={i} className='rounded-xl flex justify-between bg-[#2E2EFF]/[.50] w-auto h-[4.5vh] p-1 m-2'>
                                                <Text size={15} color='black'>{x.regNo}</Text>
                                                <PendingRequestModal data={x} />
                                            </div>
                                        )
                                    })
                                }
                            </ScrollArea>
                        </div>
                    </div>
                    <div className='w-[32%] h-auto bg-[#fff]/[.50] rounded-xl'>
                        <div className='flex flex-col justify-between'>
                            <Text className='text-[1rem] text-black font-medium p-2'>Rejected Requests</Text>
                            <ScrollArea w={'auto'} h={'15vh'}>
                                {
                                    rejectedRequests.map((x, i) => {
                                        return (
                                            <div key={i} className='rounded-xl flex justify-between bg-[#ff0000]/[.50] w-auto h-[4.5vh] p-1 m-2'>
                                                <Text size={15} color='black'>{x.regNo}</Text>
                                                <Button className=''>View</Button>
                                            </div>
                                        )
                                    })
                                }
                            </ScrollArea>
                        </div>
                    </div>
                    <div className='w-[32%] h-auto bg-[#fff]/[.50] rounded-xl'>
                        <div className='flex flex-col justify-between'>
                            <Text className='text-[1rem] text-black font-medium p-2'>Granted Requests</Text>
                            <ScrollArea w={'auto'} h={'15vh'}>
                                {
                                    grantedRequests.map((x, i) => {
                                        return (
                                            <div key={i} className='rounded-xl flex justify-between bg-[#0FFF50]/[.50] w-auto h-[4.5vh] p-1 m-2'>
                                                <Text size={15} color='black'>{x.regNo}</Text>
                                                <Button className=''>View</Button>
                                            </div>
                                        )
                                    })
                                }
                            </ScrollArea>
                        </div>
                    </div>
                </div>
                <div className='w-[95vw] h-[32.4vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[2.2vh] rounded-xl p-4'>
                    <h2 className='text-[1rem] text-[#fff] font-medium'>Your Mentees</h2>
                    <ScrollArea w={'auto'} h={'26vh'}>
                        {
                            mentees.map((x, i) => {
                                return (
                                    <div key={i} className='rounded-xl flex justify-between bg-[#ADD8E6] w-auto h-[4.5vh] p-1 m-2'>
                                        <div className='flex justify-between'>
                                            <Text size={15} color='black'>{x.name}</Text>
                                            <Text size={15} color='black'>{x.regNo}</Text>
                                        </div>
                                        <Button className=''>View</Button>
                                    </div>
                                )
                            })
                        }
                    </ScrollArea>
                </div>
            </div>
            <Modal opened={opened} onClose={close} title="Add Information" closeOnClickOutside={false} withCloseButton={false}>
                <form id="addinformation" name='addinformation' onSubmit={handleSubmit((data) => handleNewOutpass(data))}>
                    <div className='flex flex-col p-4'>
                        <ScrollArea h={'60vh'}>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Name</label>
                                <TextInput placeholder='Please enter your name' {...register('name')} />
                                {errors?.name?.message && <small className='inline-block text-[#ff0000]'>{errors.name.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Role</label>
                                <Select placeholder='Select A role' options={facultyOptions} onChange={(e) => setSelectedRole(e)} value={selectedRole} />
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Profile Photo</label>
                                <FileInput accept="image/png,image/jpeg" placeholder='Select A Profile photo for yourself' onChange={setSelectedPhoto} />
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

export default FacultMain