"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";
import { useState } from "react";
import { WaitingListPopup } from "./waitlist-popup";
import { saveToWaitlist } from "@/api/waitlist";

export function WaitListForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Handle backend logic here
    const response = await saveToWaitlist(name, email);
    if (response.success) setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white bg-transparent"> 
      <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <User className="w-5 h-5" />
          </span>
          <Input
            type="text"
            placeholder="Full name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 bg-[#06070d] border-gray-800 focus:ring-2 focus:[#25252b]"
          />
        </div>

        {/* Email Field */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Mail className="w-5 h-5" />
          </span>
          <Input
            type="email"
            placeholder="Email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-[#06070d] border-gray-800 focus:ring-2 focus:[#25252b]"
          />
        </div>

        {/* Continue Button */}
        <Button
          type="submit"
          className="w-full bg-[#14141a] hover:bg-[#25252b] flex justify-center items-center"
        >
          Continue
          <span className="ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </Button>
      </form>
      <WaitingListPopup isOpen={isOpen} onClose={closePopup} />
    </div>
  );
}
