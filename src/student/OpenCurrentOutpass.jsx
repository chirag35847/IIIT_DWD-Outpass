import { Button, Modal, Text as MantineText, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconChevronsUpRight } from '@tabler/icons-react'
import { format } from 'date-fns';
import React from 'react'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { outPassPdf } from './outpass';

const OpenCurrentOutpass = ({data}) => {
    const [opened, { open, close }] = useDisclosure(false);
    // console.log(data?.data)

    const outPassData = {
        from:data.data.date_of_leaving,
        to: data.data.date_of_returning,
        reason: data.data.reason,
    }
    console.log(outPassData);

    const createAndDownloadPdf = () =>{
        console.log(outPassPdf(data?.data));
        return pdfMake.createPdf(outPassPdf(data?.data), 'Outpass').download();
    }

    return (
        <>
            <Button onClick={open}>Open</Button>
            <Modal opened={opened} onClose={close} title="Current Outpass">
                <div className='flex flex-col'>
                    <label className='text-[0.9rem]'>Reason of going</label>
                    <TextInput value={outPassData?.reason} readOnly />
                    <label className='text-[0.9rem] mt-2'>Going From</label>
                    <TextInput value={outPassData?.from} readOnly />
                    <label className='text-[0.9rem] mt-2'>Going Till</label>
                    <TextInput value={outPassData?.to} readOnly />
                    {
                        (data.status == 'approved') ?
                            <>
                                <div className='h-auto w-auto flex flex-col justify-center items-center mt-5'>
                                    <MantineText>Request Approved, Download Outpass</MantineText>
                                    <input onClick={createAndDownloadPdf} type="submit" className="bg-[#5C5CFF] w-full inline-block text-center p-2 text-[#fff] border border-solid border-[#43B28A] rounded-md" value={"Download"} />
                                </div>
                            </> : <>
                                <div className='h-auto w-auto flex flex-col justify-center items-center mt-5'>
                                    <MantineText>Let's wait for the approval to complete</MantineText>
                                </div>
                            </>
                    }
                </div>
            </Modal>
        </>
    )
}

export default OpenCurrentOutpass

