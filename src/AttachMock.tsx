import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import FileUpload from './FileUpload'



export default function AttachMock(props) {
    const [upload, setupload] = useState(false)
    return (
        <div className="input-container">


            {upload ? <FileUpload AP={props.AP}
                issueKey={props.issueKey}
                apiCommunication={props.apiCommunication} 
                setupload={setupload}
                setSetup={props.setSetup}/> :
                <form onSubmit={props.checkForm} >
                    <span className="input-button">
                        <input id="url" name="url" placeholder=" https://..." onChange={e => props.setUrl(e.target.value)} />
                        <span className="upload-attach"> 
                            <p className="top-bottom current"> 
                                <span>🔗</span>
                                <span>Link</span>
                            </p> 
                            <p className="top-bottom" 
                                onClick={() => setupload(true)}>
                                    <span className="upload-button">▲</span> 
                                    <span>Upload</span>
                            </p>
                        </span>
                        <button type="submit">Attach Mockup</button>
                    </span>
                </form>
            }

            {props.error && <p className="error-message">Sorry, URL is not supported. Please try again.</p>}
            {props.currentMock.summary ? <Fragment>
                <div className="quick-summary taken">
                    <p>Added on {moment(props.currentMock.summary.added).format('MMMM Do')}, {moment(props.currentMock.summary.added).fromNow()}</p>
                    <p>Service: <a href={props.currentMock.summary.url} target="_blank" rel="nofollow">{props.currentMock.summary.type}</a></p>
                    <button className="description-button" onClick={props.removeMock} >Remove Attachment</button>
                </div>
                <button className="back-button" onClick={() => { props.setSetup(true); props.setError(false) }}>BACK</button>
            </Fragment> :
                <div className="quick-summary empty">
                    <p>No Mockup Attached.</p>
                </div>
            }
        </div>
    )
}