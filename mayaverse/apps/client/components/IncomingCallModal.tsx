import { useCallStore } from "@/store/useCallStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { useRouter } from "next/navigation";

export function IncomingCallModal() {
  const { incomingCall, showModal, clearCall } = useCallStore();
  if (!showModal || !incomingCall) return null;
  const router = useRouter();
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <p className="text-xl">
          📞 Incoming video call from {incomingCall.from}
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => {
              router.push(`/video/${incomingCall.from}`);
              clearCall();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Accept
          </button>
          <button
            onClick={() => clearCall()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
