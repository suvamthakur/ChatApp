// import { FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { axiosFetch } from "@/lib/axiosFetch";
import { addChatMessages, addChats } from "@/store/chatSlice";
import { constants } from "@/lib/constants";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  setActiveChatId,
  setIsGetChats,
  setIsImageUpload,
  setShowCreateChatModal,
} from "@/store/appSlice";
import CreateChatModal from "./modals/CreateChatModal";
import PropTypes from "prop-types";
import { FaEdit } from "react-icons/fa";
import ImageUploadModal from "./modals/ImageUploadModal";

const ChatPanel = ({ showCreateChatModal }) => {
  const dispatch = useDispatch();
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const [searchChat, setSearchChat] = useState("");

  const allChats = useSelector((store) => store.chats.allChats);
  const [chats, setChats] = useState([]);

  const chatMessages = useSelector((store) => store.chats.chatMessages);
  const user = useSelector((store) => store.user);
  const { isGetChats, isImageUpload } = useSelector((store) => store.app);

  useEffect(() => {
    if (isGetChats) {
      getChats();
      dispatch(setIsGetChats(false));
    }
    setChats(allChats);
  }, [isGetChats, allChats]);

  // Search chats
  useEffect(() => {
    setChats(
      allChats.filter((chat) =>
        chat.groupName.toLowerCase().includes(searchChat.toLowerCase())
      )
    );
  }, [searchChat]);

  const getChats = async () => {
    try {
      const res = await axiosFetch(constants.GET_USER_CHATS);
      dispatch(addChats(res.data.data));
    } catch {
      toast.error("Unable to get chats");
    }
  };

  const handleChatMessages = async (chatId) => {
    try {
      if (!chatMessages[chatId]) {
        const res = await axiosFetch.get(constants.GET_MESSAGES + `/${chatId}`);
        console.log(res.data.data);
        // To show the messages in chat container
        dispatch(
          addChatMessages({
            [chatId]: res.data.data,
          })
        );
      }
      // To get the details of chat in chat container
      dispatch(setActiveChatId(chatId));
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    user && (
      <div className="h-[100vh] flex flex-col">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-zinc-200 text-2xl font-medium">Chats</h2>
            <div className="flex items-center">
              <div
                className="relative w-9 h-9 mr-3 rounded-full cursor-pointer"
                onClick={() => {
                  setShowImageUpload(true);
                  dispatch(setIsImageUpload(true));
                }}
              >
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-full h-full object-cover rounded-full"
                />
                <FaEdit className="text-zinc-100 absolute bottom-0 right-0" />
              </div>

              <Popover open={showChatOptions} onOpenChange={setShowChatOptions}>
                <PopoverTrigger asChild>
                  <Button className="pt-0 bg-zinc-700 w-10 h-10 rounded-full">
                    <span className="text-4xl">+</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-max py-1 px-0 cursor-pointer font-medium"
                >
                  <div
                    className="mb-2 px-4 py-1 hover:bg-zinc-300"
                    onClick={() => {
                      setIsCreateGroup(true);
                      setShowChatModal(true);
                      setShowChatOptions(false);
                      dispatch(setShowCreateChatModal(true));
                    }}
                  >
                    Create group
                  </div>
                  <div
                    className="px-4 py-1  hover:bg-zinc-300"
                    onClick={() => {
                      setShowChatModal(true);
                      dispatch(setShowCreateChatModal(true));
                      setShowChatOptions(false);
                    }}
                  >
                    Add user
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex items-center bg-zinc-700 rounded-full p-2 mt-4 text-zinc-200">
            <IoIosSearch className="text-xl" />
            <input
              type="text"
              className="bg-transparent outline-none ml-2 w-full"
              placeholder="Search"
              onChange={(e) => setSearchChat(e.target.value.trim())}
            />
          </div>
        </div>
        <div className="mt-3 flex-grow overflow-y-auto">
          {chats.length > 0 &&
            chats.map((chat, i) => (
              <div
                key={i}
                className="flex py-3.5 pl-2 border-b border-[#39393b] cursor-pointer hover:bg-[#39393f56]"
                onClick={() => handleChatMessages(chat._id)}
              >
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={chat.groupImage}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="ml-2">
                  <p className="font-medium text-zinc-200">{chat.groupName}</p>

                  {chat.lastMessage &&
                    Object.keys(chat.lastMessage).length > 0 && (
                      <>
                        <span className="text-zinc-300 text-sm font-medium">
                          {chat.lastMessage.senderName == user.name
                            ? "You"
                            : chat.lastMessage.senderName}
                          {": "}
                        </span>
                        <span className="text-zinc-300 text-sm">
                          {chat.lastMessage.content}
                        </span>
                      </>
                    )}
                </div>
              </div>
            ))}
        </div>

        {/* showChatModal - local state,  showCreateChatModal - redux state */}
        {showChatModal && showCreateChatModal && (
          <CreateChatModal
            isCreateGroup={isCreateGroup}
            setIsCreateGroup={setIsCreateGroup}
            allChats={allChats}
            setShowChatModal={setShowChatModal}
          />
        )}

        {/* showImageUpload is used identify whether isImageUpload is from user or group */}
        {showImageUpload && isImageUpload && (
          <ImageUploadModal
            image={user.photoURL}
            setShowImageUpload={setShowImageUpload}
          />
        )}
      </div>
    )
  );
};

ChatPanel.propTypes = {
  showCreateChatModal: PropTypes.bool,
};
export default ChatPanel;