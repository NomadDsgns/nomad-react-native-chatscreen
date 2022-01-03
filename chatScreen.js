import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

function Message({ username, message, isSender, theme }) {
    return (
        <View style={theme.ChatScreen.messageContainer}>
            <View style={{ ...theme.ChatScreen.usernameContainer, alignSelf: isSender ? "flex-start" : "flex-end"}}>
                <Text style={theme.ChatScreen.username}>{username}:</Text>
            </View>
            <Text style={{...theme.ChatScreen.message, textAlign: isSender ? "left" : "right" }}>{message}</Text>
        </View>
    )
}

//remove duplicate messages based on _id
function removeDupes({ messages }) {
    if (!Array.isArray(messages)) return []; //return empty messages array if invalid data
    return messages.filter(newMsg => messageHistory.current.every(oldMsg => newMsg._id !== oldMsg._id));
}


export default function({ messageHistory, currentUser, theme }) {
    const [ messages, setMessages ] = useState(removeDupes(messageHistory)); //remove any duplicates from array of messages
    const scrollViewRef = useRef()

    return (
        <ScrollView stickyHeaderIndices={[0]}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
                        style={theme.ChatScreen.ScrollView}>
                {messages.length === 0 &&
                    <Text style={{ textAlign: "center" }}>No Message History</Text>
                }
                { messages.length > 0 &&
                    messages.map((msg, i) => {
                        const username = msg.username === currentUser.username ? "You" : msg.username;
                        return (
                            <Message key={`${i}_${msg.username}`}
                                    username={username}
                                    message={msg.message}
                                    theme={theme}
                                    isSender={msg.username === currentUser.username} />
                        )
                    })
                }
        </ScrollView>
    )
}