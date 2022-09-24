import React, { useState, useEffect, Fragment, useRef } from 'react';

import invLogo from './img/invisionlogo.png'
import OwnerSelect from './OwnerSelect';
import AttachMock from './AttachMock';
import MockSummary from './MockSummary';

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
    const [description, addDescription] = useState(null as any);
    const [setup, setSetup] = useState(false as boolean);
    const [touchOwner, setTouchOwner] = useState(false);
    const [data, setData] = useState(null);
    const descriptionRef = useRef(null as any);
    const [newOwner, setNewOwner] = useState(null);


    const APGetProperties = async (key = designIntegrateSummary) => {
        try {
            return await props.AP.request(`/rest/api/3/issue/${issueKey}/properties/${key}`,
            ).then((data) => {
                if (data.xhr.status === 200) {
                    return data.body
                } else {
                    setError(true)
                }

            }).then(async (res) => {
                const responseJson = JSON.parse(res)
                await setData(responseJson)
                await setCurrentMock(responseJson.value)
                await responseJson.description && addDescription(responseJson.description)
                setSetup(true)
            });
        } catch (err) {
            console.log(err);
        }

    }


    useEffect(() => {
        APGetProperties(designIntegrateSummary)
    }, [])



    const apiEntityWrite = async (dataObject) => {
        try {
            await props.AP.request({
                url: '/rest/api/3/issue/' + issueKey + '/properties/' + designIntegrateSummary,
                type: 'PUT',
                contentType: 'application/json',
                data: data,
                experimental: true
            }).then((res) => {
                const jsonify = JSON.parse(dataObject)
                setCurrentMock(jsonify)
                addDescription(null)
            }).then(async () => {
                //phone everyone about the new addition 
                const info = JSON.stringify({
                    "htmlBody": `A ticket you are watching has a new mockup attached.`,
                    "subject": "A Mockup Attached to ticket",
                    "textBody": `A ticket you are watching has a new mockup attached. `,
                    "to": {
                        "reporter": true,
                        "assignee": true,
                    }
                })

                await props.AP.request({
                    url: `/rest/api/3/issue/${issueKey}/notify`,
                    type: "POST",
                    contentType: "application/json",
                    data: info,
                    experimental: true
                }).then((response) => console.log(response))
                    .catch((err) => console.log(err))

            })
        } catch (err) {
            const jsonify = JSON.parse(dataObject);
            setCurrentMock(jsonify);
            addDescription(null);
        }

    }

    const figmaApi = async (service, id) => {
        if (service === 'Figma') {
            const apiId = `figma-${id}`;
            if (id) {
                const token = process.env.REACT_APP_FIGMA as string
                const figma = await fetch(`https://api.figma.com/v1/files/${id}`, {
                    headers: {
                        "X-Figma-Token": token
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
                    await apiEntityWrite(figmaObject)
                })
            } else {
                console.log('Sorry, could not find an ID')
            }

        }
    }
    const noSupport = (url, service) => {
        const xdData = JSON.stringify({
            summary: {
                type: service,
                thumbnail: null,
                url,
                iframe: null
            }
        })
        apiEntityWrite(xdData)

    }

    const iFrameIt = async (url, service) => {
        let thumbnail = null as any;
        const arr_url = url.split('.')
        const last = arr_url[arr_url.length - 1];
        const logo = (service === 'Invision') && invLogo;


        const img = (last === 'jpg') ? thumbnail = url : thumbnail = logo

        const iFrameData = JSON.stringify({
            "summary": {
                "type": service,
                "thumbnail": img,
                "url": url,
                "iframe": url
            }
        })

        apiEntityWrite(iFrameData)

    }
    const imageCommunication = async (url) => {
        const imageData = JSON.stringify({
            "summary": {
                "type": "Image",
                "thumbnail": url,
                "url": url,
                "iframe": null,
                "lastEdited": null,
                "added": new Date()
            }
        })
        apiEntityWrite(imageData)
        setSetup(true)
        setError(false)
    }

    const checkForm = async (e) => {
        e.preventDefault();
        const userInput = url.split('/')
        const urlSplit = url.split('.')
        const urlEnding = urlSplit[urlSplit.length - 1]
        const isimg = /jpeg|jpg|png/g;
        const isItAnImage = urlEnding.match(isimg);


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
                    setSetup(true)
                    figmaApi('Figma', id)
                    setSetup(true)
                    break;
                case findService('animaapp'):
                    iFrameIt(url, "Anima");
                    setSetup(true)
                    setError(false)
                    break;
                case findService('adobe'):
                    noSupport(url, "Adobe XD")
                    setError(false);
                    setSetup(true)
                    break;
                case findService('docs.google'):
                    iFrameIt(url, "Google Drive")
                    setError(false);
                    setSetup(true)
                    break;
                case findService('invis'):
                    setError(false)
                    iFrameIt(url, "Invision")
                    setSetup(true)
                    break;
                default:
                    setError(true)
            }
        } else if (isItAnImage) {
            imageCommunication(url)
        } else {
            setError(true)
        }

    }
    const modifyMock = async e => {
        setSetup(false)
    }

    const removeMock = async e => {
        e.preventDefault();
        try {
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
        })
        }catch(err) {
            setCurrentMock({"summary": null});
            addDescription(null);
        }

    }

    const submitDescription = async (e) => {
        e.preventDefault();
        const newJson = { ...currentMock, "description": description }

        const spreaded = JSON.stringify(newJson)
        await apiEntityWrite(spreaded);
        setSetup(false)
    }
    const cancelDescript = (e) => {
        e.preventDefault();
        descriptionRef.current.value = currentMock.description
    }

    return (
        <Fragment>
            {setup && currentMock.summary && !error ?
                <MockSummary
                    currentMock={currentMock}
                    submitDescription={submitDescription}
                    addDescription={addDescription}
                    modifyMock={modifyMock}
                    AP={props.AP}
                    which="full"
                    data={data}
                    issueKey={issueKey}
                    touchOwner={touchOwner}
                    setTouchOwner={setTouchOwner}
                    entity={designIntegrateSummary}
                    removeMock={removeMock}
                    newOwner={newOwner}
                    setNewOwner={setNewOwner} />
                :

                <AttachMock
                    currentMock={currentMock}
                    removeMock={removeMock}
                    modifyMock={modifyMock}
                    submitDescription={submitDescription}
                    addDescription={addDescription}
                    error={error}
                    touchOwner={touchOwner}
                    setTouchOwner={setTouchOwner}
                    checkForm={checkForm}
                    setError={setError}
                    setSetup={setSetup}
                    setUrl={setUrl}
                    issueKey={issueKey}
                    AP={props.AP}
                    data={data}
                    figmaApi={apiEntityWrite}
                    newOwner={newOwner}
                    setNewOwner={setNewOwner}
                />
            }
        </Fragment>
    )
}