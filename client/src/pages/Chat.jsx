import ChatContainer from "@/components/ChatContainer";
import ChatPanel from "@/components/ChatPanel";
import { axiosFetch } from "@/lib/axiosFetch";
import { constants } from "@/lib/constants";
import { addUser } from "@/store/userSlice";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import socketContext from "@/lib/socketContext";
import { setIsGetChats } from "@/store/appSlice";
import { exitChat, removeUserFromChat } from "@/store/chatSlice";

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const { showCreateChatModal, isImageUpload } = useSelector(
    (store) => store.app
  );

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login");
    } else {
      getProfile();
    }
  }, []);

  // Socket context is at the bottom
  const [socket, setSocket] = useState(null);

  // Socket Connection
  useEffect(() => {
    if (user?._id) {
      const socket = io(import.meta.env.VITE_BASE_URL, {
        query: { userId: user?._id },
      });
      setSocket(socket);
    }

    return () => socket?.close();
  }, [user?._id]);

  // Listening to events
  useEffect(() => {
    if (socket) {
      // new chat
      socket.on("chat_created", () => {
        dispatch(setIsGetChats(true));
      });

      // Added into a group
      socket.on("added_into_group", () => {
        dispatch(setIsGetChats(true));
      });

      // Removed a user
      socket.on("user_removed", (chatId, userId) => {
        console.log("remove", chatId, userId);
        if (userId == user._id) {
          console.log("remove me: ", chatId);
          dispatch(exitChat(chatId));
        } else {
          dispatch(removeUserFromChat({ chatId, userId }));
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("chat_created");
        socket.off("added_into_group");
        socket.off("user_removed");
      }
    };
  }, [socket]);

  const getProfile = async () => {
    try {
      if (!user) {
        const res = await axiosFetch(constants.GET_PROFILE);
        dispatch(addUser(res.data.data));
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <socketContext.Provider value={{ socket: socket }}>
      <div
        className={
          "h-[100vh] w-[100vw] flex " +
          (showCreateChatModal || isImageUpload
            ? "blur pointer-events-none"
            : "")
        }
      >
        <div className="w-[30vw] h-full p-3 bg-zinc-800">
          <ChatPanel showCreateChatModal={showCreateChatModal} />
        </div>
        <div className="w-[70vw]">
          <ChatContainer />
        </div>
      </div>
    </socketContext.Provider>
  );
};
export default Chat;
