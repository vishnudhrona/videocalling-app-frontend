import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Peer } from "peerjs";

const Remoteuservideocallpage = () => {
  const [peerId, setPeerId] = useState("");
  const [incomingCall, setIncomingCall] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [peerIdUrl, setPeerIdUrl] = useState(null);
  const peerInstance = useRef(null);
  const remoteVideoRef = useRef(null);
  const currentVideoRef = useRef(null);

  const navigate = useNavigate()
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlRemotePeerId = params.get("peerId")


  useEffect(() => {
    setPeerIdUrl(urlRemotePeerId);
  }, [urlRemotePeerId]);

  useEffect(() => {
    const peer = new Peer();

    peer.on("error", (error) => {
      console.error("PeerJS error:", error);
    });

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      setIncomingCall(call);
    });

    peerInstance.current = peer;
  }, []);

  const acceptCall = () => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      setMediaStream(mediaStream);
      currentVideoRef.current.srcObject = mediaStream;
      currentVideoRef.current.play();
      incomingCall.answer(mediaStream);

      incomingCall.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play().catch((error) => {
              console.error(error, "play error");
            });
          };
        }
      });
    });
  };

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentVideoRef.current.srcObject = mediaStream;
      currentVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call?.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {

          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play().catch((error) => {
              console.error(error, "play error");
            });
          };
        }
      });
    });
  };

  const endCall = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    if (incomingCall) {
      incomingCall.close();
      setIncomingCall(null);
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.pause();
      remoteVideoRef.current.srcObject = null;
    }
    if (currentVideoRef.current) {
      currentVideoRef.current.pause();
      currentVideoRef.current.srcObject = null;
    }
    window.location.reload()
  };

  return (
    <div className="bg-black h-screen">
    <div className="flex justify-center">
      <video ref={currentVideoRef} className="pt-14 ml-72 absolute w-28" />
      <video ref={remoteVideoRef} className="pt-10" style={{ width: '800px', height: '400px' }} />
    </div>
    <div className="flex justify-center items-center p-5">
      {peerIdUrl ? (
        <button className="text-white bg-green-500 text-sm px-3 py-2 rounded-lg mr-5" onClick={() => call(urlRemotePeerId)}>
          Ask To Join
        </button>
      ) : (
        <input type="text" value={peerIdUrl} />
      )}
      <button className="text-white bg-red-500 text-sm px-3 py-2 rounded-lg" onClick={endCall}>
        End Call
      </button>
    </div>
</div>
  )
}

export default Remoteuservideocallpage
