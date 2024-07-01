import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { composeActions } from '../../store/compose-reducer';
import classes from './Inbox.module.css';

const Inbox = () => {
    const mails = useSelector((state) => state.compose.fetchMail);
    const dispatch = useDispatch();
    const [selectedMail, setSelectedMail] = useState(null);

    const userMailId = localStorage.getItem('email');
    const userMail = userMailId.split('.').join('');

    const fetchMails = useCallback(async () => {
        try {
            const res = await axios.get(
                `https://mail-box-78488-default-rtdb.firebaseio.com/${userMail}Inbox.json`
            );
            console.log('Fetched mails:', res.data);
            dispatch(composeActions.fetchMail(res.data || {}));
        } catch (error) {
            console.error('Error fetching mails:', error);
        }
    }, [dispatch, userMail]);

    useEffect(() => {
        fetchMails();
        const interval = setInterval(fetchMails, 2000);

        return () => clearInterval(interval);
    }, [fetchMails]);

    const deleteHandler = async (mailId) => {
        try {
            await axios.delete(
                `https://mail-box-78488-default-rtdb.firebaseio.com/${userMail}Inbox/${mailId}.json`
            );
            fetchMails();
            setSelectedMail(null);
        } catch (error) {
            console.error('Error deleting mail:', error);
        }
    };

    const singleMailHandler = async (mailId) => {
        try {
            await axios.patch(
                `https://mail-box-78488-default-rtdb.firebaseio.com/${userMail}Inbox/${mailId}.json`,
                { read: true }
            );
            fetchMails();
            setSelectedMail(mails[mailId]);
        } catch (error) {
            console.error('Error marking mail as read:', error);
        }
    };

    return (
        <section className={classes.inbox}>
            <h1>Received Mails</h1>
            <div>
                <ul>
                    {mails && Object.keys(mails).length > 0 ? (
                        Object.keys(mails).map((mailId) => {
                            const mail = mails[mailId];
                            const read = mail.read !== false;
                            return (
                                <div key={mailId}>
                                    <div onClick={() => singleMailHandler(mailId)}>
                                        <li
                                            style={{
                                                listStyleType: read ? 'none' : 'disc',
                                                color: read ? 'black' : 'blue',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <span>From: {mail.from}</span>
                                        </li>
                                    </div>
                                    <button onClick={() => deleteHandler(mailId)}>Delete</button>
                                    <hr />
                                </div>
                            );
                        })
                    ) : (
                        <p>No mails found</p>
                    )}
                </ul>
            </div>
            {selectedMail && (
                <div className={classes.mailContent}>
                    <h2>Mail Content</h2>
                    <p><strong>From:</strong> {selectedMail.from}</p>
                    <p><strong>Subject:</strong> {selectedMail.subject}</p>
                    <p><strong>Body:</strong> {selectedMail.body}</p>
                </div>
            )}
        </section>
    );
};

export default Inbox;

