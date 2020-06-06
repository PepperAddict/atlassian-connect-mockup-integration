import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import invLogo from './img/invisionlogo.png'

interface ApiCall {
    issueKey: string
    AP: any
    issueId: string
}

export default function ApiCall(props: ApiCall) {
    const [url, setUrl] = useState(null as any);
    const [designIntegrateSummary] = useState('design-integrate_summary')
    const [error, setError] = useState(false);
    const [issueKey] = useState(props.issueKey);
    const [currentMock, setCurrentMock] = useState({ "summary": null } as any);
    const [iframe, setIframe] = useState(null as any);
    const [description, addDescription] = useState(null as any)

    const APGetProperties = async (issue, key = 'proj') => {

        const properties = await props.AP.request(`/rest/api/3/issue/${issueKey}/properties/${key}`,
        ).then((data) => {
            if (data.xhr.status === 200) {
                return data.body
            } else {
                setError(true)
            }

        }).then(async (res) => {
            const responseJson = JSON.parse(res)
            console.log(responseJson)

            await setCurrentMock(responseJson.value)


        });
    }

    useEffect(() => {
        try {
            APGetProperties(issueKey, designIntegrateSummary)

        } catch {
            console.log('none')
        }

    }, [])



    const apiEntityWrite = async (data) => {
        await props.AP.request({
            url: '/rest/api/3/issue/' + issueKey + '/properties/' + designIntegrateSummary,
            type: 'PUT',
            contentType: 'application/json',
            data: data,
            experimental: true
        }).then((res) => {
            const jsonify = JSON.parse(data)
            setCurrentMock(jsonify)
            addDescription(null)
        }).catch((err) => {
            console.log(err)
        });
    }

    const apiCommunication = async (service, id, issue = issueKey) => {
        if (service === 'Figma') {
            const apiId = `figma-${id}`;
            if (id) {
                const figma = await fetch(`https://api.figma.com/v1/files/${id}`, {
                    headers: {
                        "X-Figma-Token": `${process.env.FIGMA}`
                    }
                })
                await figma.json().then(async (res) => {
                    const figmaFile = "https://figma.com/file/" + id

                    const figmaObject = JSON.stringify({ 
                    "summary": {
                        "type": service,
                        "id": apiId,
                        "name": res.name,
                        "iframe": null,
                        "url": figmaFile,
                        "thumbnail": res.thumbnailUrl,
                        "lastEdited": res.lastModified 
                    }

                })
                    apiEntityWrite(figmaObject)

                })
            } else {
                console.log('Sorry, could not find an ID')
            }

        }
    }

    const invisio = async (url, version, id = null) => {
        let thumbnail = null as any;
        const arr_url = url.split('.')
        const last = arr_url[arr_url.length - 1];
        const img = (last === 'jpg') ? thumbnail = url : thumbnail = invLogo



        const invisData = JSON.stringify({
            "summary": {
                "type": "Invision",
                "thumbnail": img,
                "url": url,
                "iframe": url
            }
        })

        apiEntityWrite(invisData)

    }
    const imageCommunication = async (url) => {
        const imageData = JSON.stringify({
            "summary": {
                "type": "custom",
                "thumbnail": url,
                "iframe": null,
                "lastEdited": new Date()
            }
        })
        apiEntityWrite(imageData)
    }

    const checkForm = async (e) => {
        e.preventDefault();
        const userInput = url.split('/')
        const urlSplit = url.split('.')
        const urlEnding = urlSplit[urlSplit.length - 1]
        const isimg = /jpeg|jpg|png|svg/g;
        const isItAnImage = urlEnding.match(isimg)

        if (userInput.length > 1 && !isItAnImage) {
            const cloudUrl = userInput[2]

            const findService = (service) => {
                if (cloudUrl.includes(service)) {
                    return cloudUrl
                }
            }
            switch (cloudUrl) {
                case findService('figma'):
                    const id = userInput[4];
                    setError(false)
                    apiCommunication('Figma', id, issueKey)
                    break;
                case findService('xd'):
                    console.log('this is xd');
                    setError(false);
                    break;
                case findService('google'):
                    console.log('this is google');
                    setError(false)
                    break;
                case findService('invis'):
                    setError(false)
                    const invid = userInput[3]
                    invisio(url, 'simple', invid)
                    break;
                default:
                    console.log('no recognized service')
                    setError(true)
            }
        } else {
            imageCommunication(url)
        }

    }

    const removeMock = async e => {
        e.preventDefault();
        await props.AP.request({
            url: '/rest/api/3/issue/' + issueKey + '/properties/' + designIntegrateSummary,
            type: 'PUT',
            contentType: 'application/json',
            data: `{"summary": null}`,
            experimental: true
        }).then((res) => {
            console.log('deleted')
            setCurrentMock({ "summary": null })
            addDescription(null)
        }).catch((err) => {
            console.log(err)
        });
    }

    const submitDescription = (e) => {
        e.preventDefault();
        const newJson = { ...currentMock, "description": description }

        const spreaded = JSON.stringify(newJson)
        apiEntityWrite(spreaded)
    }

    return (
        <Fragment>
            <form onSubmit={checkForm}>
                <label>
                    <p>Mock URL!</p>
                    <input name="url" placeholder="http://..." onChange={e => setUrl(e.target.value)} />
                    <button type="submit">Mock Cloud URL</button>
                </label>
            </form>

            {currentMock.summary ? <div className="showProject">

                {currentMock.summary.iframe ? <div className="iframe-container">
                    <iframe id="protoframe" src={currentMock.summary.iframe}></iframe></div> : 
                    <div className="img-container"><img src={currentMock.summary.thumbnail} /></div>}
                <div>
                    <p>Service: {currentMock.summary.type}</p>
                    {currentMock.summary.lastEdited && <p>last modified: {moment(currentMock.summary.lastEdited).format('MMMM Do YYYY, h:mm:ss a')} | {moment(currentMock.summary.lastEdited).fromNow()}</p>}
                    {currentMock.summary.url && <p>Link: <a href={currentMock.summary.url}>{currentMock.summary.type} Link</a></p>}
                    <button className="remove-button" onClick={e => removeMock(e)}> Remove Mock</button>
                    <form onSubmit={submitDescription}>
                        <label>
                            Description
                            <textarea name="description" onChange={e => addDescription(e.target.value)} defaultValue={(currentMock.description) ? currentMock.description : null} />
                            <button type="submit">Submit Description</button>
                        </label>

                    </form>
                </div>
            </div> : <p>Nothing attached</p>}

        </Fragment>
    )
}