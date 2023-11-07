import { Button, Modal, TextInput, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react'

const RejectedRequestsModal = ({ outpassData, teacherName }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [outpass, setOutpass] = useState();

    const data = outpassData.data

    const fetchCurrentOutpass = useCallback(() => {
        const current = {
            regNo: data.regNo,
            from: format(new Date(data.from), 'do LLL, yyyy'),
            to: format(new Date(data.to), 'do LLL, yyyy'),
            reason: data.reason,
            rejectedBy: teacherName,
            rejectedRemarks: outpassData.outpassData.remarks[outpassData.outpassData.remarks.length - 1],
        }
        setOutpass(current)
    }, [data])

    useEffect(() => {
        if (opened) {
            fetchCurrentOutpass();
        }
    }, [opened])

    return (
        <>
            <Modal opened={opened} onClose={close} title="Rejected Request">
                <div className='flex flex-col'>
                    <label className='text-[0.9rem]'>Student RegNo</label>
                    <div className='w-[100%] flex justify-between'>
                        <div className='w-[70%]'>
                            <TextInput value={outpass?.regNo} readOnly />
                        </div>
                        <div className='bg-[#0000FF] rounded-md'>
                            <ViewMenteeModal facultyData={facultyData} data={outpassData.data} />
                        </div>
                    </div>
                    <label className='text-[0.9rem] mt-2'>Going From</label>
                    <TextInput value={outpass?.from} readOnly />
                    <label className='text-[0.9rem] mt-2'>Going Till</label>
                    <TextInput value={outpass?.to} readOnly />
                    <label className='text-[0.9rem] mt-2'>Reason For Going</label>
                    <TextInput value={outpass?.reason} readOnly />
                    <label className='text-[0.9rem] mt-2'>Rejected By</label>
                    <TextInput value={outpass?.rejectedBy} readOnly />
                    <label className='text-[0.9rem] mt-2'>Rejected Remarks</label>
                    <Textarea value={outpass?.rejectedRemarks} readOnly />
                </div>
            </Modal>
            <Button onClick={open}>View</Button>
        </>
    )
}

export default RejectedRequestsModal