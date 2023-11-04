import { Button, Modal, ScrollArea, TextInput } from '@mantine/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const PendingRequestModal = ({ data }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [outpass, setOutpass] = useState();

    const fetchCurrentOutpass = useCallback(() => {
        const current = {
            id: data.id,
            regNo: data.regNo,
            from: data.from,
            to: data.to,
            reason: "Going Home",
        }
        setOutpass(current)
    }, [data])

    const schema = z.object({
        remarks: z.string().refine(val => val.length > 0, { message: "Approval Remarks Cannot Be Empty" }),
    })
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (opened) {
            fetchCurrentOutpass();
        }
    }, [opened])

    return (
        <>
            <Modal opened={opened} onClose={close} title="Pending Request">
                <div className='flex flex-col'>
                    <label className='text-[0.9rem]'>Student RegNo</label>
                    <TextInput value={outpass?.regNo} readOnly/>
                    <form id="approvalForm" name='approvalForm' onSubmit={handleSubmit((data) => handleNewOutpass(data))}>
                        <div className='flex flex-col p-4'>
                            <ScrollArea h={'60vh'}>
                                <div className='flex flex-col mb-3'>
                                    <label className='text-[0.9rem]'>Name</label>
                                    <TextInput placeholder='Please enter your name' {...register('name')} />
                                    {errors?.name?.message && <small className='inline-block text-[#ff0000]'>{errors.name.message}</small>}
                                </div>
                            </ScrollArea>
                            <div className='flex justify-end w-[100%] mt-5'>
                                <input type="submit" className="bg-[#5C5CFF] w-full inline-block text-center p-2 text-[#fff] border border-solid border-[#43B28A] rounded-xl" value={"Submit"} />
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
            <Button onClick={open}>View</Button>
        </>
    )
}

export default PendingRequestModal