import { Text } from '@mantine/core';
import React from 'react'

const OutpassHistoryListItem = ({itemData,key}) => {
    const bg=`bg-[${itemData.verdict=='rejected'?'#ff0000':'#0FFF50'}]/[.50]`;
    console.log(bg);
  return (
    <div style={{backgroundColor:itemData.verdict=='rejected'?'#ff0000':'#0FFF50',opacity:0.5}} className={`flex rounded-xl w-[100%] h-[6vh] p-2 mb-3`} key={key}>
        <div className='w-[100%] flex justify-between'>
            <Text>{itemData?.verdict.toUpperCase()}</Text>
            <div>
                {
                    itemData?.verdict!='rejected'?
                    <div className='ml-4 flex flex-col'>
                        <Text>{`Checkout Date : ${itemData.checkoutDate}`}</Text>
                        <Text>{`Checkin  In   : ${itemData.checkinDate}`}</Text>
                    </div>:
                    <div className='ml-4 flex flex-col'>
                        <Text>{`Rejected Reason : ${itemData.rejectedReason}`}</Text>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default OutpassHistoryListItem