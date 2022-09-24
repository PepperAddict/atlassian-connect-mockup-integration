import React, { useState, useEffect, Fragment } from 'react';
import Loading from './loading';
import AttachButtons from './AttachButtons'


export default function FileUpload(props) {
    const [file, setFile] = useState(null as any);
    const [loading, setloading] = useState(false)

    const theFile = e => {
        console.log(e)
        setFile(e)
    }

    const uploadMe = e => {
        e.preventDefault();

        if (file) {
            setloading(true)
            let uploadDetail = e.target[0].files[0];
            let name = 'design-integrate-' + uploadDetail.name

            let file = new File([uploadDetail], name, {
                type: uploadDetail.type
            });

            try {
                props.AP.request({
                    url: '/rest/api/3/issue/' + props.issueKey + '/attachments',
                    type: "POST",
                    contentType: "multipart/form-data",
                    data: { file: file },
                    headers: {
                        "X-Atlassian-Token": "nocheck"
                    }
                }).then((res) => {
                    return JSON.parse(res.body);
                }).then(async (text) => {

                    const saveInfo = JSON.stringify({
                        summary: {
                            type: text[0].mimeType + " Attachment",
                            url: text[0].content,
                            added: text[0].created,
                            thumbnail: text[0].thumbnail,
                            id: text[0].id
                        }

                    })
                    await props.apiCommunication(saveInfo)

                }).then((next) => {
                    setloading(false)
                    props.setSetup(true)
                })

            } catch (err) {
                const saveInfo = JSON.stringify({
                    summary: file
                })
                props.apiCommunication(saveInfo)

            }

        }


    }
    return (

        <Fragment>
            <form onSubmit={uploadMe} className="input-button">
                <AttachButtons setupload={props.setupload} which="upload" />

                <label htmlFor="upload" className="upload-label">
                    Upload {file ? file.type + ': ' + file.name.substring(0, 20) + '... ' : "Mockup"}
                </label>
                <input id="upload" type="file" name="attachment" onChange={e => theFile(e.target.files![0])} />

                <button type="submit">Upload Mockup</button>

            </form>
            <div className={loading ? "loading show" : "loading hide"}>{loading && <Loading />}</div>
        </Fragment>
    )
}