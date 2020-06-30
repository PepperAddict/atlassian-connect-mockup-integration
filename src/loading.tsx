import React, {Fragment} from 'react';

export default function Loading() {
    return (
        <Fragment>
        <div className="loading-text">Uploading Mockup</div>
        <div className="spinner">
            
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
        </Fragment>
    )
}