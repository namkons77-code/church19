"use client";

import { useState } from "react";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  className?: string;
  fallbackClassName?: string;
}

export default function UserAvatar({
  name,
  avatarUrl,
  className = "w-8 h-8 rounded-full object-cover",
  fallbackClassName = "w-8 h-8 rounded-full bg-[#60984B] text-white flex items-center justify-center text-xs font-extrabold",
}: UserAvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const canShowImage = Boolean(avatarUrl && failedUrl !== avatarUrl);

  if (canShowImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setFailedUrl(avatarUrl ?? null)}
        className={className}
      />
    );
  }

  return (
    <span className={fallbackClassName} aria-label={name}>
      {(name || "성").slice(0, 1)}
    </span>
  );
}
