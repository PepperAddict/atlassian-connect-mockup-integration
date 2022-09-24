import React, { useState, useRef, Fragment } from 'react';
import moment from 'moment';
import OwnerSelect from './OwnerSelect';
export default function MockSummary(props) {


    return (
        <div className="showProject">
            {props.currentMock.summary.iframe ?
                <div className="iframe-container">
                    <iframe title="design-thumbnail" id="protoframe" src={props.currentMock.summary.iframe}></iframe>
                    </div> : (props.currentMock.summary.thumbnail) ?
                    <div className="img-container">
                        <img src={props.currentMock.summary.thumbnail} alt="image thumbnail" />
                    </div> :
                    <div className="no-thumbnail-container">
                        Sorry, No Thumbnail Available
                    </div>
            }
            <OwnerSelect data={props.data} 
            summary={props.currentMock} 
            AP={props.AP} 
            issueKey={props.issueKey} 
            touchOwner={props.touchOwner} 
            setTouchOwner={props.setTouchOwner} 
            entity={props.designIntegrateSummary}
            newOwner={props.newOwner}
            setNewOwner={props.setNewOwner} />

            
                {!props.touchOwner && <div className="summary-content">
                    <p><strong>Service:</strong> {props.currentMock.summary.type}</p>
                    {props.currentMock.summary.lastEdited ?
                        <p><strong>Last modified:</strong> {moment(props.currentMock.summary.lastEdited).format('MMMM Do h:mm A')}, {moment(props.currentMock.summary.lastEdited).fromNow()}</p>
                        : <p><strong>Added:</strong> {moment(props.currentMock.summary.added).format('MMMM Do h:mm A')}, {moment(props.currentMock.summary.added).fromNow()}</p>}
                    {props.currentMock.summary.url && <p><strong>Link:</strong> <a href={props.currentMock.summary.url} target="_blank" rel="nofollow">{props.currentMock.summary.type} URL</a></p>}

                            
                            {(props.which==="quick") ? <Fragment>
                                <div className="quick-description">
                                    <strong>Description</strong>
                            <div className="description-span">
                                {props.currentMock.description}
                            </div>
                            
                            <span className="simple-buttons">
                            <button onClick={e => props.removeMock(e)} >Remove Attachment</button>
                            <button onClick={() => {props.setSetup(true); props.setError(false) }}>Edit Description</button>
                            </span></div>
                            </Fragment>: 
                            
                            <Fragment>
                                <form className="description-container" onSubmit={props.submitDescription}>
                                    <label>
                                        <strong>Description</strong>

                                <textarea name="description" onFocus={e => props.addDescription(e.target.value)} onChange={e => props.addDescription(e.target.value)} defaultValue={(props.currentMock.description) ? props.currentMock.description : null} />
                                <span className="descript-button">
                                <span className="cancel-descript" onClick={e => props.modifyMock(e)}>Cancel</span><button className="description-button" type="submit">Save</button>
                            </span></label>
                            </form>
                            </Fragment>}
                            
               </div>}




            
        </div>
    )
}