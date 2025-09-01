"use client"
import React from "react"
import ReactPlayer from "react-player"

export default function YouTubePreview({ url }: { url: string }) {
  return (
    <div className="mt-6 rounded-xl overflow-hidden shadow-lg border border-indigo-100">
      <ReactPlayer
        src={url}  
        controls
        width="100%"
        height="360px"
      />
    </div>
  )
}

type YouTubeEmbedProps = { url: string }

export function YouTubeEmbed({ url }: YouTubeEmbedProps) {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  )
  const videoId = videoIdMatch ? videoIdMatch[1] : null

  if (!videoId) return null

  return (
    <div className="mt-4 w-full aspect-video rounded-xl overflow-hidden shadow">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}
