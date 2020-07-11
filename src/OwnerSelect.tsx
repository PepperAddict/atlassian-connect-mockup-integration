import React, { useEffect, useState, Fragment } from 'react';

export default function OwnerSelect(props) {
    const [ownerList, setOwnerList] = useState([] as any);
    const [currentOwner, thisOwner] = useState(null as any);
    const [newOwner, setNewOwner] = useState(null as any);
    const [ mounted, setMounted] = useState(false)

    const writeToEntity = async data => {

        await props.AP.request({
            url: '/rest/api/3/issue/' + props.issueKey + '/properties/' + 'design-integrate_summary',
            type: 'PUT',
            contentType: 'application/json',
            data: data,
            experimental: true
        }).then(async () => {
            const jsonify = JSON.parse(data)
            await setNewOwner(jsonify.owner)

        }).catch((err) => {
            console.log(err)
        });
    }
    const selectNewOwner = async (e, owner) => {

        if (props.data.value) {
            const newOwner = JSON.stringify({
                summary: {
                    ...props.summary.summary,
                },
                owner: {
                    avatarUrl: owner.avatarUrl,
                    displayName: owner.displayName,
                    accountId: owner.accountId
                },
                description: (props.summary.description) ? props.summary.description : null
            })
            await writeToEntity(newOwner)

        }
    }

    const searchUser = (input) => {
        props.AP.request(`/rest/api/3/user/picker?excludeConnectUsers=true&showAvatar=true&maxResults=4&query="${input}"`).then((data) => {
            return JSON.parse(data.body)
        }).then((res) => {
            setOwnerList(res.users)
        })
    }

    const getCreator = async () => {
        await props.AP.request(`/rest/api/3/issue/${props.issueKey}`,
        ).then((data) => {
            if (data.xhr.status === 200) {
                return JSON.parse(data.body)
            }
        }).then(async (res) => {
            const newSet = {
                avatarUrl: res.fields.creator.avatarUrls["48x48"],
                displayName: res.fields.creator.displayName,
                email: res.fields.creator.emailAddress
            }

            await thisOwner(newSet)
        }).catch((err) => console.log(err))
    }


    const touchedOwner = async (e, owner) => {
        await selectNewOwner(e, owner)
        props.setTouchOwner(false)
        await props.setNewOwner(owner)
    }

    const iconTouch = e => {
        if (props.touchOwner === false) {
            props.setTouchOwner(true)
        } else {
            props.setTouchOwner(false)
        }
    }


    useEffect(() => {
        setMounted(true)
        if (mounted) {
            if (!newOwner && props.data.value.hasOwnProperty('owner')) {
                thisOwner(props.data.value.owner)
            } else if (newOwner) {
                return
            }
             else {
                getCreator()
            }
        }

    }, [mounted])

    return (
        <Fragment>
            {props.newOwner ? <p onClick={e => iconTouch(e)} className="owner-avatar-container">Owner: <img className="owner-avatar" src={props.newOwner.avatarUrl} alt={props.newOwner.displayName} /></p> :
            (currentOwner) &&
                <p onClick={e => iconTouch(e)} className="owner-avatar-container">Owner: <img className="owner-avatar" src={currentOwner.avatarUrl} alt={currentOwner.displayName} /></p>}
            {(props.touchOwner === true) &&
                <form>
                    <label>Enter Owner of Mockup
                        <input onChange={e => searchUser(e.target.value)} className="user-list-input" />
                        <ul className="user-list-container">
                            {ownerList.length > 0 && ownerList.slice(0, 4).map((indi, key) => {
                                return <li key={key} onClick={e => touchedOwner(e, indi)}><img className="owner-avatar" src={indi.avatarUrl} />{indi.html}</li>
                            })}
                        </ul>

                    </label>
                </form>
            }
        </Fragment>
    )
}