/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../ChatLogics/ChatLogic";
import { useSelector } from "react-redux";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const loggedINUser = useSelector((state) => state.auth.loggedINUser);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            key={m._id}
            style={{ display: "flex" }}
            className="flex items-center  rounded-md "
          >
            {(isSameSender(messages, m, i, loggedINUser._id) ||
              isLastMessage(messages, i, loggedINUser._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === loggedINUser._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(
                  messages,
                  m,
                  i,
                  loggedINUser._id
                ),
                marginTop: isSameUser(messages, m, i, loggedINUser._id)
                  ? 3
                  : 10,
              }}
              className="mb-2 "
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
