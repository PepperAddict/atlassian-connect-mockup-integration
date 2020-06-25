import React, { useEffect, useState, Fragment } from 'react';

export default function OwnerSelect(props) {
    const [ownerList, setOwnerList] = useState([] as any);
    const [currentOwner, thisOwner] = useState(null as any);
    const [newOwner, setNewOwner] = useState(null as any);
    const [data, setData] = useState(null)

    const writeToEntity = async data => {

        await props.AP.request({
            url: '/rest/api/3/issue/' + props.issueKey + '/properties/' + 'design-integrate_summary',
            type: 'PUT',
            contentType: 'application/json',
            data: data,
            experimental: true
        }).then((res) => {
            const jsonify = JSON.parse(data)
            setNewOwner(jsonify.owner)
        }).catch((err) => {
            console.log(err)
        });
    }
    const selectNewOwner = (e, owner) => {
        console.log(props.data)

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
            writeToEntity(newOwner)
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


    const touchedOwner = (e, owner) => {
        selectNewOwner(e, owner)
        props.setTouchOwner(false)
    }
    const iconTouch = e => {
        if (props.touchOwner === false) {
            props.setTouchOwner(true)
        } else {
            props.setTouchOwner(false)
        }
    }
    useEffect(() => {

        if (props.data.value.hasOwnProperty('owner')) {
            setNewOwner(props.data.value.owner)
            console.log(newOwner)
        } else {
            getCreator()
        }


    }, [])

    return (
        <Fragment>
            {newOwner ? <p onClick={e => iconTouch(e)} className="owner-avatar-container">Owner: <img className="owner-avatar" src={newOwner.avatarUrl} alt={newOwner.displayName} /></p> : (currentOwner) &&
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