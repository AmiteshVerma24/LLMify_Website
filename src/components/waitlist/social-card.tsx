// components/SocialCard.tsx
import { ReactElement } from "react";

interface SocialCardProps {
  username: string; 
  icon: ReactElement; 
  bgColor?: string; 
}

export function SocialCard({
  username,
  icon,
  bgColor = "bg-gray-900", 
}: SocialCardProps) {
  return (
    <div
      className={`flex items-center space-x-2 p-2 ${bgColor} text-white rounded-md shadow-sm w-fit`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">{icon}</div>

      {/* Content */}
      <div>
        <p className="text-xs text-gray-400">@{username}</p>
      </div>
    </div>
  );
}
