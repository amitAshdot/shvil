import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

function DropZone(props) {
    const { handleFiles } = props
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files

        handleFiles(acceptedFiles)
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :

                    (<>

                    </>)
            }
        </div>
    )
}
export default DropZone