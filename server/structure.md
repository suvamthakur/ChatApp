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
- GET /chat/messages/:chatId (After clicking a particular chat) 
- PATCH /chat/add/:chatId (body: userId)
- PATCH /chat/remove/:chatId (body: userId)
- PATCH /chat/toggleBlock/:chatId
- PATCH /chat/update/:chatId (formData: groupImage)
- PATCH /chat/exit/:chatId
- DELETE /chat/delete/:chatId

# Message
- POST /message/:chatId 
- DELETE /message/:messageId 