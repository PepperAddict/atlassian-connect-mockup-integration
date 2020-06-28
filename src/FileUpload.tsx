import React, { useState, useEffect, Fragment } from 'react';


export default function FileUpload(props) {

    const getAttachment = async () => {
        await props.AP.request({
            url: '/rest/api/3/issue/' + props.issueKey + '?fields=attachment',
            type: 'GET'
        }).then((res) => {
            if (res.xhr.status === 200) return res.body
        }).then((response) => {
            console.log(JSON.parse(response))
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        getAttachment()

    }, [])

    const uploadMe = e => {
        e.preventDefault();
        let formUpload = new FormData();
        let uploadDetail = e.target[0].files[0];
        let name = 'design-integrate-' + uploadDetail.name
        let formAgain = {
            filename: name, 
            file: uploadDetail.name, 
            type: uploadDetail.type, 
            uploaded: uploadDetail.lastModifiedDate
        }
        formUpload.append('file', formAgain as any)
        

        props.AP.request({
            url: '/rest/api/3/issue/' + props.issueKey + '/attachments',
            type: "POST",
            contentType: "multipart/form-data",
            data: formAgain,
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
                "X-Atlassian-Token": "nocheck"
            }
        }).then((res) => {
            return res.body;
        }).then((text) => console.log(console.log(text)))
        .catch((err) => console.log(err))


    }
    return (
        <form onSubmit={uploadMe}>

            <input type="file" name="attachment" />
            <button type="submit">Submit</button>
        </form>
    )
}