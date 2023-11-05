import { Button, Checkbox, Group, Modal, ScrollArea, TextInput, Textarea } from '@mantine/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import updateOutpassStatusByRoleAndAcceptance from '../firebase-helpers/outpass_updater'

const PendingRequestModal = ({ outpassData , teacherRole}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [outpass, setOutpass] = useState();
    
    const data = outpassData.data

    const fetchCurrentOutpass = useCallback(() => {
        const current = {
            regNo: data.regNo,
            from: format(new Date(data.from), 'do LLL, yyyy'),
            to: format(new Date(data.to), 'do LLL, yyyy'),
            reason: data.reason,
        }
        setOutpass(current)
    }, [data])

    const [approve,setApprove] = useState();
    const schema = z.object({
        remarks: z.string().refine(val => val.length > 0, { message: "Approval Remarks Cannot Be Empty" }),
        approval: z.string().refine(val => val.length > 0, { message: "Apprval Cannot be empty" })
    })
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (opened) {
            fetchCurrentOutpass();
        }
    }, [opened])

    const handleOutpass = useCallback(async (thisdata) => {
        console.log(thisdata)
        let accept = thisdata.approval == 'approved' ? true : false;

        await updateOutpassStatusByRoleAndAcceptance(teacherRole, accept, data.id, thisdata.remarks)
        close()
    }, [])

    return (
        <>
            <Modal opened={opened} onClose={close} title="Pending Request">
                <div className='flex flex-col'>
                    <label className='text-[0.9rem]'>Student RegNo</label>
                    <TextInput value={outpass?.regNo} readOnly />
                    <label className='text-[0.9rem] mt-2'>Going From</label>
                    <TextInput value={outpass?.from} readOnly />
                    <label className='text-[0.9rem] mt-2'>Going Till</label>
                    <TextInput value={outpass?.to} readOnly />
                    <label className='text-[0.9rem] mt-2'>Reason For Going</label>
                    <TextInput value={outpass?.reason} readOnly />

                    <form id="approvalForm" name='approvalForm' onSubmit={handleSubmit((data) => handleOutpass(data))}>
                        <div className='flex flex-col p-4'>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Approval</label>
                                <div className="flex">
                                    <Checkbox
                                        checked={approve}
                                        onChange={e=>{
                                            setValue('approval','approved')
                                            setApprove(true)
                                        }}
                                        label="Approve"
                                        className="mr-2"
                                    />
                                    <Checkbox
                                        checked={!approve}
                                        defaultChecked
                                        label="Reject"
                                        onChange={e=>{
                                            setValue('approval','rejected')
                                            setApprove(false)
                                        }}
                                    />
                                </div>
                                {errors?.approval?.message && <small className='inline-block text-[#ff0000]'>{errors.approval.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Remarks</label>
                                <Textarea placeholder='Please enter remarks' {...register('remarks')} />
                                {errors?.remarks?.message && <small className='inline-block text-[#ff0000]'>{errors.remarks.message}</small>}
                            </div>
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