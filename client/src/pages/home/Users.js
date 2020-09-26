import React from "react";
import { gql, useQuery } from "@apollo/client";
import {Col, Image} from "react-bootstrap";
import { useMessageDispatch, useMessageState } from '../../context/message';
import classNames from "classnames";

const GET_USERS = gql`
    query getusers{
        getUsers{
            username createdAt imageUrl
            latestMessage{
                uuid from to content createdAt
            }
        }
    }
`

export default function Users(){
    const dispatch = useMessageDispatch()
    const { users } = useMessageState()
    const selectedUser = users?.find( u => u.selected === true)?.username

    const { loading } = useQuery(GET_USERS, {
        onCompleted: data => dispatch({ type: 'SET_USERS', payload: data.getUsers }),
        onError: err => console.log(err)
    })


    let usersMarkup
    if (!users || loading){
        usersMarkup = <p>Loading...</p>
    } else if (users.length === 0) {
        usersMarkup = <p>No user have joined yet</p>
    } else if (users.length > 0) {
        usersMarkup = users.map((user) => {
            const selected = selectedUser === user.username
            return(
            <div
                role="button"
                className={classNames("user-div d-flex justify-content-center justify-content-md-start p-3",{
                    'bg-white': selected,
                })}
                key={user.username}
                onClick={() => dispatch({ type: 'SET_SELECTED_USER', payload: user.username })}>
                <Image src={user.imageUrl}
                       className="user-image"
                />
                <div className="d-done d-md-block ml-2">
                    <p className="text-success m-0">{user.username}</p>
                    <p className="font-weight-light m-0">
                        {user.latestMessage ? user.latestMessage.content : 'You are now connected!'}
                    </p>
                </div>
            </div>
            )
        })
    }

    return (
        <div>
            <Col xs={12} className="p-0 bg-secondary">
                {usersMarkup}
            </Col>
        </div>
    )

}