User Flow for One-to-One WebRTC Call
🧑‍💻 User Flow

    User A opens chat with User B [x]

    Clicks Video Call Button[x]

    User A creates an SDP offer (via RTCPeerConnection.createOffer) [x]

    Offer sent via signaling (WebSocket) to TS backend [x]

    TS backend forwards the offer to User B [x]

    User B receives call prompt (UI popup: Accept / Reject) [x]

    If User B accepts:

        Creates RTCPeerConnection

        Sets offer as remote description

        Creates answer SDP

        Sends answer SDP back via WebSocket → TS backend → User A

    User A receives answer

        Sets it as remote description

    Both start exchanging ICE candidates

        As they're gathered (via onicecandidate), they’re sent via WebSocket signaling

        Forwarded by TS backend to the other peer

    ICE candidates used to find optimal connection path

    Peer connection is established

    Media tracks (audio/video) are attached and start flowing
