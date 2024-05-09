import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Peer } from "peerjs";
import instance from '../../Axios/Axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Videocallpage = () => {

  const [peerId, setPeerId] = useState("");
  const [inviteButtonClicked, setInviteButtonClicked] = useState(false);
  const [calling, setCalling] = useState(true)
  const [incomingCall, setIncomingCall] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const peerInstance = useRef(null);
  const remoteVideoRef = useRef(null);
  const currentVideoRef = useRef(null);

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const userEmail = urlParams.get("useremail");

  const navigate = useNavigate()

  const invitePatient = () => {
    instance.get(`/invitingpatient?peerId=${peerId}&useremail=${userEmail}`).then((response) => {
      if(response.data.status) {
        toast.success('Link is send to the specified remote user email !', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Zoom,
      });
      }
    })
    setInviteButtonClicked(true);
  };

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
    setCalling(false)
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
    navigate('/')
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
      <div className="bg-black">
        <div className="flex justify-center pt-10">

          <video
            ref={currentVideoRef}
            className="pt-14 ml-72 absolute w-28"
          />
          <video
            ref={remoteVideoRef}
            className="pt-10"
            style={{ width: "800px", height: "400px" }}
          />

          {incomingCall && calling && (
            <div className="absolute bg-green-500 w-52 h-64 flex justify-center rounded-lg px-5 py-5">
              <img
                className="vibrate-image"
                src="https://cdn3d.iconscout.com/3d/premium/thumb/phone-ring-4916113-4094471.png"
                alt=""
              />
              <span className=" absolute bg-green-500  text-slate-900 rounded-2x font-bold p-2">
                Press Accept Button
              </span>
            </div>
          )}

        </div>

        <div className="flex justify-center items-center p-5">
          <div className="">
            {incomingCall && calling && (
              <div className="">
                <button
                  className="text-white bg-green-400 text-sm px-3 py-2 rounded-lg mr-5"
                  onClick={acceptCall}
                >
                  Accept Call
                </button>
              </div>
            )}
          </div>

          <button
            className="text-white bg-red-500 hover:bg-red-600 text-sm px-3 py-2 rounded-lg mr-5"
            onClick={endCall}
          >
            End Call
          </button>
          <button
            className="text-white bg-blue-500 hover:bg-blue-600 text-sm px-3 py-2 rounded-lg"
            onClick={invitePatient}
          >
            Invite
          </button>
        </div>
      </div>
    </>
  )
}

export default Videocallpage
