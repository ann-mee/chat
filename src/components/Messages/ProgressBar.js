import React from 'react'
import { Progress } from 'semantic-ui-react'

const ProgressBar = ({percentUploaded, uploadState}) => (
    uploadState === 'uploading' && (
        <Progress
            className="progress__bar" 
            percent={percentUploaded}
            progress
            indicating
            size="small"
            inverted 
            color="black"
        />
    )
)

export default ProgressBar