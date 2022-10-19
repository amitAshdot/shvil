import React from 'react'
import Lottie from "lottie-react";
import LUploading from "../../assets/lottie/L-uploading.json";
const UploadingAnimation = (props) => {
    return (
        <div className='lottie-uploading'>
            {props.startUpload ?
                <Lottie loop={true} autoplay={true} animationData={LUploading} />
                :
                <Lottie loop={false} autoplay={false} animationData={LUploading} />}
        </div>
    )
}

export default UploadingAnimation