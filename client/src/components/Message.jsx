import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
import { setReply } from "@/store/messageSlice";
import { axiosFetch } from "@/lib/axiosFetch";
import { constants } from "@/lib/constants";
import toast from "react-hot-toast";
import { FaFilePdf } from "react-icons/fa";

const Message = ({ messageInfo, chatDetails }) => {
  const { senderId, photoURL, content, name, replyTo, attachment } =
    messageInfo;
  const { isGroup } = chatDetails;

  const dispatch = useDispatch();
  const [isMyMessage, setIsMyMessage] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (senderId == user._id) {
      setIsMyMessage(true);
    }

    const handleClick = () => {
      setShowModal(false);
    };
    document.body.addEventListener("click", handleClick);

    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [showModal]);

  const handleDeleteMessage = async () => {
    try {
      await axiosFetch.delete(constants.DELETE_MESSAGE + `/${messageInfo._id}`);
      toast.success("Message deleted");
    } catch (err) {
      toast.error(err?.response?.data?.msg);
    }
  };

  // const handleDownloadFile = () => {
  //   if (!attachment?.url) return;

  //   const fileUrl = `${attachment.url}?fl_attachment`; // Add Cloudinary attachment flag
  //   const fileName = attachment.name || "download";

  //   const link = document.createElement("a");
  //   link.href = fileUrl;
  //   link.download = fileName;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  return (
    ((user && content.length > 0) || attachment) && (
      <div className="my-2" id={messageInfo._id}>
        <div className={"flex " + (isMyMessage ? "justify-end" : "")}>
          {!isMyMessage && isGroup && (
            <div className="w-8 h-8 rounded-full">
              <img
                className="w-full h-full object-cover rounded-full"
                src={photoURL}
                alt=""
              />
            </div>
          )}
          <div
            className="relative bg-zinc-800 px-2 py-1.5 ml-1.5 rounded-tl-sm rounded-bl-xl rounded-tr-xl rounded-br-sm cursor-pointer"
            onMouseEnter={() => setShowArrow(true)}
            onMouseLeave={() => setShowArrow(false)}
          >
            {replyTo && (
              <div className="bg-zinc-900 text-sm px-3 py-1 mb-1 rounded flex items-center gap-x-3">
                <div>
                  <p className="font-medium text-zinc-400">
                    {replyTo.senderId == user._id ? "You" : replyTo.senderName}
                  </p>

                  <p className="text-zinc-200 text-[15px]">
                    {replyTo.messageContent}
                  </p>
                </div>

                <div>
                  {replyTo.attachment &&
                    Object.keys(replyTo.attachment).length > 0 && (
                      <div className="w-10 h-10 my-2">
                        {replyTo.attachment.type.includes("image") && (
                          <img
                            src={replyTo.attachment.url}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        )}

                        {replyTo.attachment.type.includes("video") && (
                          <video
                            src={replyTo.attachment.url}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        )}

                        {replyTo.attachment.type.includes("pdf") && (
                          <div className="text-zinc-200 flex items-center">
                            <FaFilePdf className="text-2xl" />
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            )}

            <div className="px-2">
              {isGroup && (
                <p className="font-medium text-zinc-400">
                  {!isMyMessage && name}
                </p>
              )}

              {/* Show attachments in the UI */}
              {attachment && Object.keys(attachment).length > 0 && (
                <div className="w-72 my-2">
                  {attachment.type.includes("image") && (
                    <a
                      href={attachment.url}
                      target="_blank"
                      download={attachment}
                    >
                      <img src={attachment.url} className="w-full" alt="" />
                    </a>
                  )}
                  {attachment.type.includes("video") && (
                    <video
                      src={attachment.url}
                      controls
                      className="w-full"
                      alt=""
                    />
                  )}

                  {attachment.type.includes("pdf") && (
                    <a
                      href={attachment.url}
                      target="_blank"
                      download={attachment}
                    >
                      <div className="text-zinc-200 flex items-center">
                        <FaFilePdf className="text-2xl" />
                        <span className="text-zinc-400 ml-2">
                          {attachment.name && attachment.name.length > 28
                            ? attachment.name.substring(0, 28) + "..."
                            : attachment.name}
                        </span>
                      </div>
                    </a>
                  )}
                </div>
              )}

              {content.length > 0 && (
                <p className="text-zinc-200 text-[15px]">{content}</p>
              )}
            </div>

            {showArrow && (
              <IoIosArrowDown
                className="absolute top-0.5 right-0.5 cursor-pointer text-zinc-400 bg-zinc-800 rounded-full text-xl"
                onMouseEnter={() => setShowArrow(true)}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(!showModal);
                }}
              />
            )}

            {/* Reply, Delete message option */}
            {showModal && (
              <div className="absolute top-10 right-0 z-40 bg-zinc-800 w-max py-2 text-zinc-300 cursor-pointer rounded">
                <p
                  className="py-2 px-5 hover:bg-zinc-900"
                  onClick={() =>
                    dispatch(
                      setReply({
                        messageId: messageInfo._id,
                        senderId,
                        name,
                        content,
                        attachment: attachment ? attachment : null,
                      })
                    )
                  }
                >
                  Reply
                </p>
                {(isMyMessage || senderId == user._id) && (
                  <p
                    className="py-2 px-5 hover:bg-zinc-900"
                    onClick={() => handleDeleteMessage()}
                  >
                    Delete
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

Message.propTypes = {
  messageInfo: PropTypes.object,
  chatDetails: PropTypes.object,
};

export default Message;