import React from 'react'
import Papa from 'papaparse'

function App() {

    const handleFile = (event) => {
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines:false,
            complete: function(result) {
                const columnArr = []
                const valuesArr = []

                result.data.map((d) => {
                    columnArr.push(Object.keys(d));
                    valuesArr.push(Object.values(d));
                })

                console.log(columnArr[0])
                console.log(valuesArr)
            }
        })
    }
    return (
        <div>
            <input
            type='file'
            name='file'
            accept='.csv'
            onChange={handleFile}
            style={{display:"block", margin:"10px auto"}}>
            </input>
        </div>
    )
}

export default App