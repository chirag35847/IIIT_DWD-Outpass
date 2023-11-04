import { Button, Modal, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react'
import React, { useCallback, useEffect, useState } from 'react'
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select'

const facultyOptions = [
    { value: "SWC", label: "SWC" },
    { value: "Warden", label: "Warden" }
]

const EditInformationModal = ({ data }) => {
    // console.log(data)
    const [opened, { open, close }] = useDisclosure(false);

    const schema = z.object({
        name: z.string().refine(val => val.length > 0, { message: "Name Cannot be empty" })
    })
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

    const handleInformation = useCallback((d) => {
        console.log(d);
    }, [])

    const [facultyName, setFacultyName] = useState();
    useEffect(() => {
        if (opened) {
            if(data?.name){
                setFacultyName(data?.name)
                setValue('name',data?.name)
            }
        }
    }, [opened])

    return (
        <>
            <Modal opened={opened} onClose={close} title="Edit Your Information">
                <div className='flex flex-col'>
                    <label className='text-[0.9rem]'>Email</label>
                    <TextInput value={data?.email} readOnly />

                    <form id="editIfnfo" name='editIfnfo' onSubmit={handleSubmit((data) => handleInformation(data))}>
                        <div className='flex flex-col mt-2'>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Name</label>
                                <TextInput value={facultyName} onChange={(e) => {
                                    setFacultyName(e.target.value)
                                    setValue('name', e.target.value)
                                }} {...register('name')} />
                                {errors?.name?.message && <small className='inline-block text-[#ff0000]'>{errors.name.message}</small>}
                            </div>
                            <div className='flex justify-end w-[100%] mt-5'>
                                <input type="submit" className="bg-[#5C5CFF] w-full inline-block text-center p-2 text-[#fff] border border-solid border-[#43B28A] rounded-xl" value={"Submit"} />
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
            <Button rightIcon={<IconEdit size={14} />} onClick={open}>Edit</Button>
        </>
    )
}

export default EditInformationModal