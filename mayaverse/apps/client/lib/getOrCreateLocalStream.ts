import { useStreamStore } from "@/store/useStreamStore";

export const getOrCreateLocalStream = async (): Promise<MediaStream> => {
  const { localStream, setLocalStream } = useStreamStore.getState();

  if (localStream) return localStream;

  const newStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  setLocalStream(newStream);
  return newStream;
};
