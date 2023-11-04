import { Button, Modal, TextInput, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react'

const RejectedRequestsModal = ({ data }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [outpass, setOutpass] = useState();

    const fetchCurrentOutpass = useCallback(() => {
        const current = {
            id: data.id,
            regNo: data.regNo,
            from: format(new Date(data.from), 'do LLL, yyyy'),
            to: format(new Date(data.to), 'do LLL, yyyy'),
            reason: "Going Home",
            rejectedBy: "Faculty Advisor",
            rejectedRemarks: "Inconsistency Found",
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
                    <TextInput value={outpass?.regNo} readOnly />
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