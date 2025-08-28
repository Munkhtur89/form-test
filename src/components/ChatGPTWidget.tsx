"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Upload, Send, Loader2, FileIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Robots from "../../public/Robots.json";
import dynamic from "next/dynamic";
import { MdDelete } from "react-icons/md";

interface ChatGPTWidgetProps {
  apiKey: string;
}

interface ChatMessage {
  message: string;
  sender: string;
  direction: "incoming" | "outgoing";
  sentTime: string;
  position: "single" | "first" | "normal" | "last";
  imageUrl?: string | null;
}
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});
function MessageLoading() {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse delay-150"></div>
      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse delay-300"></div>
    </div>
  );
}

export default function ChatGPTWidget({ apiKey }: ChatGPTWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message: "Сайн байна уу, би ChatGPT! Асуултаа бичээрэй!",
      sentTime: "яг одоо",
      sender: "ChatGPT",
      position: "single",
      direction: "incoming",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(file.name);
    }
  };

  const handleSendFile = async () => {
    if (!selectedFile) return;
    setIsTyping(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result;
      let newMessage: ChatMessage;
      if (selectedFile.type.startsWith("image/")) {
        newMessage = {
          message: selectedFile.name,
          direction: "outgoing",
          sender: "user",
          sentTime: new Date().toLocaleTimeString(),
          position: "single",
          imageUrl: typeof base64 === "string" ? base64 : undefined,
        };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        if (typeof base64 === "string") {
          await processImageToGPT4V(base64, newMessages);
        } else {
          setIsTyping(false);
        }
      } else if (selectedFile.type === "application/pdf") {
        newMessage = {
          message: `PDF файл илгээгдлээ: ${selectedFile.name}`,
          direction: "outgoing",
          sender: "user",
          sentTime: new Date().toLocaleTimeString(),
          position: "single",
        };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        await processMessageToChatGPT(newMessages);
      } else {
        newMessage = {
          message: `Файл илгээгдлээ: ${selectedFile.name}`,
          direction: "outgoing",
          sender: "user",
          sentTime: new Date().toLocaleTimeString(),
          position: "single",
        };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        await processMessageToChatGPT(newMessages);
      }
      setSelectedFile(null);
      setFilePreview(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  async function processMessageToChatGPT(chatMessages: ChatMessage[]) {
    const lastUserMessage = chatMessages
      .filter((m) => m.sender === "user")
      .slice(-1)[0];
    const apiRequestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: lastUserMessage.message }],
        },
      ],
    };
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => data.json())
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
            sentTime: new Date().toLocaleTimeString(),
            position: "single",
            direction: "incoming",
            imageUrl: null,
          },
        ]);
        setIsTyping(false);
      });
  }

  async function processImageToGPT4V(
    base64: string,
    chatMessages: ChatMessage[]
  ) {
    const apiRequestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Энэ зураг Монгол улсын иргэний үнэмлэхний ур тал уу, ар тал уу? Яагаад гэдгийг тайлбарла. Зурган дээрх бүх текст болон мэдээллийг дэлгэрэнгүй тайлбарла.",
            },
            { type: "image_url", image_url: { url: base64 } },
          ],
        },
      ],
      max_tokens: 500,
    };
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => data.json())
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
            sentTime: new Date().toLocaleTimeString(),
            position: "single",
            direction: "incoming",
          },
        ]);
        setIsTyping(false);
      })
      .catch(() => setIsTyping(false));
  }

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = {
      message: chatInput,
      direction: "outgoing",
      sender: "user",
      sentTime: new Date().toLocaleTimeString(),
      position: "single",
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    setChatInput("");
    await processMessageToChatGPT(newMessages);
  };

  return (
    <div className="space-y-8 sticky top-8 ml-2 max-w-[700px] bg-[#1e1e1e]  rounded-lg">
      <h1 className="m-4">Ai</h1>
      <div className="backdrop-blur-lg bg-[#292929] m-4  shadow-xl rounded-2xl overflow-hidden min-h-[320px] flex flex-col ">
        {/* Header */}

        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto max-h-200">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } mb-2`}
              >
                {msg.sender !== "user" && (
                  <Avatar className="h-15 w-15 mr-2 mt-1 flex-shrink-0">
                    {/* <AvatarFallback className=" text-blue-700">
                      AI 
                    </AvatarFallback> */}
                    <Lottie
                      autoplay
                      loop
                      animationData={Robots}
                      height={15}
                      width={15}
                    />
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-900 text-white"
                  }`}
                >
                  {msg.imageUrl && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={msg.imageUrl}
                        alt="Илгээсэн зураг"
                        className="max-w-full h-auto object-contain"
                        width={15}
                        height={15}
                      />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.message}</div>
                  <div className="text-xs opacity-70 mt-1">{msg.sentTime}</div>
                </div>
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                    <AvatarFallback className=" text-gray-700">
                      Та
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-2">
                <Avatar className="h-15 w-15 mr-2 mt-1 flex-shrink-0">
                  <Lottie
                    autoplay
                    loop
                    animationData={Robots}
                    height={15}
                    width={15}
                  />
                  {/* <AvatarFallback className=" text-blue-700">
                    AI
                  </AvatarFallback> */}
                </Avatar>
                <div className="max-w-[75%] rounded-2xl px-4 py-3 text-sm bg-gray-100 text-gray-900">
                  <MessageLoading />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File upload area */}
      {selectedFile ? (
        <div className="mx-4 py-3 px-4 bg-gray-50 border-t border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="bg-blue-100 p-2 rounded-full">
                <FileIcon className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium truncate max-w-[200px] text-black">
                {filePreview}
              </span>
            </div>
            <button
              type="button"
              className="text-xs text-gray-900 hover:text-red-500"
              onClick={() => {
                setSelectedFile(null);
                setFilePreview(null);
              }}
            >
              <MdDelete color="red" size={24} />
            </button>
          </div>
        </div>
      ) : null}

      {/* Input area */}
      <div className="p-4  backdrop-blur-sm bg-[#1e1e1e]">
        <form
          className="flex items-center gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (selectedFile) {
              await handleSendFile();
            } else {
              await handleSendChat(e);
            }
          }}
        >
          <label
            htmlFor="ai-file-upload"
            className="flex-shrink-0 cursor-pointer"
          >
            <div className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <Upload className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="ai-file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              disabled={isTyping}
            />
          </label>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 rounded-full text-black border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
            placeholder="Асуултаа бичих..."
            disabled={isTyping || !!selectedFile}
          />
          <button
            type="submit"
            className="bg-blue-600 cursor-pointer text-white rounded-full px-4 py-2 hover:bg-blue-700 transition-colors flex items-center justify-center h-12 w-12"
            disabled={isTyping || (!chatInput.trim() && !selectedFile)}
          >
            {isTyping ? (
              <Loader2 className="h-20 w-20 animate-spin" />
            ) : (
              <Send className="h-20 w-20" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
