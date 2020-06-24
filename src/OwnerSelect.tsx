import React, { useEffect, useState } from 'react';

export default function OwnerSelect(props) {
    const [ownerList, setOwnerList] = useState([] as any);
    const [currentOwner, thisOwner] = useState(null as any);
    const [newOwner, setNewOwner] = useState(null as any)

    const selectNewOwner = (e, id) => {
        e.preventDefault();
        console.log(id)
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
            const newSet = await {
                icon: res.fields.creator.avatarUrls["16x16"],
                displayname: res.fields.creator.displayName,
                email: res.fields.creator.emailAddress
            }

            await thisOwner(newSet)
            console.log(newSet)
            
        }).then(() => {
           console.log(currentOwner) 
        }).catch((err) => console.log(err))
    }
    useEffect(() => {
        //Set Default Owner if property is not there
        getCreator()

    }, [])

    return (
        
        <form onClick={e => props.setTouchOwner(true)}>
            <label>Enter Owner of Mockup
            <input onChange={e => searchUser(e.target.value)} />
                <ul>
                    {ownerList.length > 0 && ownerList.slice(0, 4).map((indi, key) => {
                        return <li key={key} onClick={e => selectNewOwner(e, indi.accountId)}>{indi.html}</li>
                    })}
                </ul>

            </label>
        </form>
    )
}