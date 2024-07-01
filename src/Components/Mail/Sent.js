import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { composeActions } from '../../store/compose-reducer';
import classes from './Inbox.module.css';

const Sent = () => {
    const mails = useSelector((state) => state.compose.sentMail);
    const dispatch = useDispatch();
    const [selectedMail, setSelectedMail] = useState(null);

    const userMailId = localStorage.getItem('email');
    const userMailKey = userMailId.split('.').join(''); // This is used for API calls

    const fetchSentMails = useCallback(async () => {
        try {
            const res = await axios.get(
                `https://mail-box-78488-default-rtdb.firebaseio.com/${userMailKey}SentMail.json`
            );
            console.log('Fetched sent mails:', res.data); // Log the API response
            dispatch(composeActions.fetchSentMail(res.data));
        } catch (error) {
            console.error('Error fetching sent mails:', error); // Log any errors
        }
    }, [dispatch, userMailKey]);

    useEffect(() => {
        fetchSentMails();
        const interval = setInterval(() => {
            fetchSentMails();
        }, 2000);

        return () => clearInterval(interval);
    }, [fetchSentMails]);

    const handleMailClick = async (mailId) => {
        try {
            await axios.patch(
                `https://mail-box-78488-default-rtdb.firebaseio.com/${userMailKey}SentMail/${mailId}.json`,
                { read: true }
            );
            fetchSentMails();
            setSelectedMail(mails[mailId]);
        } catch (error) {
            console.error('Error marking sent mail as read:', error); // Log any errors
        }
    };

    const handleBack = () => {
        setSelectedMail(null);
    };

    useEffect(() => {
        console.log('Updated sent mails state:', mails); // Log the updated state
    }, [mails]);

    return (
        <section className={classes.inbox}>
            <h1>Sent Mails</h1>
            <div>
                <ul>
                    {mails && Object.keys(mails).length > 0 ? (
                        Object.keys(mails).map((mailId) => {
                            const mail = mails[mailId];
                            const read = mail.read !== false;
                            return (
                                <div key={mailId}>
                                    <div onClick={() => handleMailClick(mailId)}>
                                        <li
                                            style={{
                                                listStyleType: read ? 'none' : 'disc',
                                                color: read ? 'black' : 'blue',
                                                cursor: 'pointer',
                                            }}>
                                            <span>To: {mail.to}</span>
                                        </li>
                                    </div>
                                    <hr />
                                </div>
                            );
                        })
                    ) : (
                        <p>No sent mails found</p>
                    )}
                </ul>
            </div>
            {selectedMail && (
                <div className={classes.mailContent}>
                    <h2>Mail Content</h2>
                    <p><strong>To:</strong> {selectedMail.to}</p>
                    <p><strong>Subject:</strong> {selectedMail.subject}</p>
                    <p><strong>Body:</strong> {selectedMail.body}</p>
                    <button onClick={handleBack}>Back</button>
                </div>
            )}
        </section>
    );
};

export default Sent;
