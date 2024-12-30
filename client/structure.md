## Requirements
- Login/Signup/Auth
- User can add/create/delete group and other user and send messages
- User can delete a message
- User can block/unblock other user
- User can edit their profile
- Admin can add, remove user (group)

## Models
- User {id, name, email, photoURL}
- Chat {id, admin(ref User), userIds[](ref User), isGroup, lastMessage(ref Message), blockedUser(ref User)}
- Message {id, content, senderId(ref User), chatId(ref Chat), attachment{type, url}, timestamp}

## APIs
# Auth
- POST /auth/signup 
- POST /auth/login 

# User
- GET /user/profile 
- PATCH /user/profile (formData: userImage)
- GET /user/profile/all 
- GET /user/chats (Get all chats of the user) 

# Chat
- POST /chat/create 

>> create_chat <chatId, users, adminId> (Api call: GET /user/chats)

- GET /chat/messages/:chatId (After clicking a particular chat) 

- PATCH /chat/add/:chatId (body: userId)

>> user_added<chatId> (Api call: GET /user/chats)

- PATCH /chat/remove/:chatId (body: userId)

>> user_removed<chatId, userId> (Redux: removeUser(userId, chatId))

- PATCH /chat/toggleBlock/:chatId

>> user_blocked<chatId>[userId,chatId] (Redux: blockUser(userId, chatId))
>> user_unblocked<chatId>[userId,chatId] (Redux: unblockUser(userId, chatId))
 
- PATCH /chat/update/:chatId (formData: groupImage)

>> chat_update<chatId> (Api call: GET /user/chats)

- PATCH /chat/exit/:chatId

>> user_removed<chatId>[userId,chatId] (Redux: removeUser(userId, chatId))

- DELETE /chat/delete/:chatId
>> delete_chat<chatId>[chatId] (Redux: deleteChat(chatId))

# Message
- POST /message/:chatId 
>> new_message<chatId>[userId,chatId,message:{content,attachmentUrl,replyTo}] (Redux: setlastChatMessage(userId,chatId,message:{content,attachmentUrl}))

- DELETE /message/:messageId 