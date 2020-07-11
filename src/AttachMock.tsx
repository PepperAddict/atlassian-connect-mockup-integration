import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import FileUpload from './FileUpload';
import AttachButtons from './AttachButtons';
import MockSummary from './MockSummary';



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
                        <AttachButtons setupload={setupload} which="url"/>
                        <input id="url" name="url" placeholder="Paste URL" onChange={e => props.setUrl(e.target.value)} />
                        
                        
                        <button type="submit">Attach Mockup</button>
                    </span>
                </form>
            }

            {props.error && <p className="error-message">Sorry, URL is not supported. Please try again.</p>}

            {props.currentMock.summary ? <Fragment>

                <MockSummary 
                    currentMock={props.currentMock}
                    submitDescription={props.submitDescription}
                    addDescription={props.addDescription}
                    AP={props.AP}
                    which="quick"
                    data={props.data}
                    setError={props.setError}
                    setSetup={props.setSetup}
                    removeMock={props.removeMock}
                    issueKey={props.issueKey}
                    modifyMock={props.modifyMock}
                    touchOwner={props.touchOwner}
                    setTouchOwner={props.setTouchOwner}
                    newOwner={props.newOwner}
                    setNewOwner={props.setNewOwner}/>
            </Fragment> :
                <div className="quick-summary empty">
                    <p>No Mockup Attached.</p>
                </div>
            }
        </div>
    )
}