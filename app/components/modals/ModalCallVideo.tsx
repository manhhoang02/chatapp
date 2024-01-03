import React, {useEffect, useRef, useState} from 'react';
import {appSize} from '@abong.code/config/AppConstant';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import color from '@abong.code/theme/color';
import {useAppContext} from '@abong.code/context/AppProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';
import {consoleLog} from '@abong.code/helpers/logHelper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  callerId: string;
  calleeId: string;
  name: string;
  avatar: string;
  isVisible: boolean;
  onClose: () => void;
};
export default function ({
  calleeId,
  callerId,
  name,
  avatar,
  isVisible,
  onClose,
}: Props) {
  const {socket, user} = useAppContext();
  const {top, bottom} = useSafeAreaInsets();
  const [isCall, setIsCall] = useState(false);
  const [cameraCount, setCameraCount] = useState(0);
  const [isVoiceOnly, setIsVoiceOnly] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const peerConnection = useRef<RTCPeerConnection>(new RTCPeerConnection(null));

  const handleCountCam = async () => {
    let cameras = 0;
    try {
      const devices = await mediaDevices.enumerateDevices();

      devices.map(device => {
        if (device.kind != 'videoinput') {
          return;
        }

        cameras = cameras + 1;
      });
      setCameraCount(cameras);
    } catch (err) {
      // Handle Error
    }
  };

  const setupWebRTC = async () => {
    const mediaConstraints = {
      audio: true,
      video: {
        frameRate: 30,
        facingMode: 'user',
      },
    };
    // let isVoiceOnly = false;

    try {
      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

      setLocalStream(mediaStream);

      const peerConstraints = {
        iceServers: [
          {urls: 'stun:stun.l.google.com:19302'},
          {urls: 'stun:stun.services.mozilla.com'},
          {urls: 'stun:stun.stunprotocol.org:3478'},
        ],
      };
      const _pc = new RTCPeerConnection(peerConstraints);

      _pc.addEventListener('icecandidate', (event: any) => {
        // When you find a null candidate then there are no more candidates.
        // Gathering of candidates has finished.
        if (event.candidate) {
          socket.emit('icecandidate', {
            ice: event.candidate,
            to: callerId === user._id ? calleeId : callerId,
          });
        }
      });
      _pc.addEventListener('iceconnectionstatechange', event => {
        consoleLog('iceconnectionstatechange', event);
      });
      _pc.addEventListener('signalingstatechange', event => {
        consoleLog('signalingstatechange', event);
        switch (_pc.signalingState) {
          case 'closed':
            // You can handle the call being disconnected here.

            break;
        }
      });
      _pc.addEventListener('track', (event: any) => {
        // Grab the remote track from the connected participant.
        let remoteMediaStream = remoteMediaStream || new MediaStream();
        setRemoteStream(remoteMediaStream);
        remoteMediaStream.addTrack(event.track, remoteMediaStream);
      });

      mediaStream
        .getTracks()
        .forEach(track => _pc.addTrack(track, mediaStream));

      peerConnection.current = _pc;
    } catch (err) {
      // Handle Error
    }
  };
  const createOffer = async () => {
    const sessionConstraints = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    };

    try {
      const offerSDP = await peerConnection.current.createOffer(
        sessionConstraints,
      );
      await peerConnection.current.setLocalDescription(offerSDP);
      socket.emit('sdp', {sdp: offerSDP, to: calleeId});
      // Send the offerDescription to the other participant.
    } catch (err) {
      // Handle Errors
    }
  };
  const createAnswer = async () => {
    try {
      const answerSDP = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answerSDP);
      consoleLog('ans', answerSDP);
      socket.emit('sdp', {sdp: answerSDP, to: callerId});
    } catch (error) {
      consoleLog('err', error);
    }
  };
  const setRemoteDescription = async (sdp: any) => {
    try {
      const sdpRemote = new RTCSessionDescription(sdp);
      await peerConnection.current.setRemoteDescription(sdpRemote);
    } catch (error) {
      consoleLog('setRemote fail', error);
    }
  };
  const addCandidate = async (candidate: any) => {
    peerConnection.current.addIceCandidate(candidate);
  };
  const handleEndCall = () => {
    localStream && localStream.getTracks().forEach(track => track.stop());
    peerConnection.current.close();
    peerConnection.current = null;
    setLocalStream(null);
  };
  const handleSwitchCam = async () => {
    try {
      // Taken from above, we don't want to flip if we don't have another camera.
      if (cameraCount < 2) {
        return;
      }
      if (localStream) {
        const videoTrack = await localStream.getVideoTracks()[0];
        videoTrack._switchCamera();
      }
    } catch (err) {
      // Handle Error
    }
  };
  const handleTurnOnOffCam = async () => {
    try {
      if (localStream) {
        let videoTrack = await localStream.getVideoTracks()[0];
        videoTrack.enabled = !isVoiceOnly;
      }
    } catch (error) {}
  };
  const handleTurnOnOffMic = async () => {
    try {
      if (localStream) {
        const audioTrack = await localStream.getAudioTracks()[0];
        audioTrack.enabled = !isMuted;
      }
    } catch (err) {
      // Handle Error
    }
  };
  useEffect(() => {
    handleTurnOnOffCam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoiceOnly]);
  useEffect(() => {
    handleTurnOnOffMic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted]);

  useEffect(() => {
    handleCountCam();
    setupWebRTC();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on('call-accept', () => {
      createOffer();
      setIsCall(true);
    });
    socket.on('call-cancel', () => {
      handleEndCall();
      setIsCall(false);
    });
    socket.on('sdp-server', sdp => {
      setRemoteDescription(sdp).then(() => {
        if (sdp.type === 'offer') {
          createAnswer();
        }
      });
    });
    socket.on('icecandidate', candidate => {
      addCandidate(candidate);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  consoleLog(remoteStream, 'rms');
  return (
    <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      animationInTiming={300}
      animationOutTiming={300}
      isVisible={isVisible}
      backdropColor={color.black04}
      style={[styles.noMargin]}>
      <View style={styles.container}>
        {isCall ? (
          <View style={styles.flex}>
            {localStream && (
              <View style={[styles.cameraCaller, {top: top + appSize(30)}]}>
                <RTCView
                  mirror={true}
                  objectFit={'cover'}
                  streamURL={localStream.toURL()}
                  zOrder={1}
                  style={[styles.flex, {borderRadius: appSize(10)}]}
                />
              </View>
            )}
            {remoteStream && remoteStream.toURL() && (
              <RTCView
                mirror={true}
                objectFit={'cover'}
                streamURL={remoteStream.toURL()}
                zOrder={0}
                style={[styles.flex, {borderRadius: appSize(10)}]}
              />
            )}
            <View
              style={[
                styles.actionBottom,
                {marginBottom: bottom + appSize(30)},
              ]}>
              <TouchableOpacity onPress={() => setIsVoiceOnly(!isVoiceOnly)}>
                {isVoiceOnly ? (
                  <MaterialIcons name="videocam-off" size={appSize(40)} />
                ) : (
                  <MaterialIcons name="videocam" size={appSize(40)} />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
                {isMuted ? (
                  <FontAwesome5 name="microphone-slash" size={appSize(30)} />
                ) : (
                  <FontAwesome5 name="microphone" size={appSize(30)} />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSwitchCam}>
                <MaterialIcons name="flip-camera-ios" size={appSize(40)} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, {borderColor: color.danger}]}
                onPress={() => {
                  socket.emit('call-cancel', {calleeId, callerId});
                }}>
                <Ionicons name="call" size={35} color={color.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.flex}>
            {localStream && (
              <RTCView
                mirror={true}
                objectFit={'cover'}
                streamURL={localStream.toURL()}
                zOrder={0}
                style={styles.flex}
              />
            )}
            <View style={styles.cameraBackgroundWait}>
              <Image
                source={
                  avatar ? {uri: avatar} : require('assets/image/profile.png')
                }
                style={styles.avatar}
                resizeMode="cover"
              />
              <Text style={styles.nameCaller}>{name}</Text>
              <View
                style={[
                  styles.contentBtn,
                  {
                    justifyContent:
                      callerId === user._id ? 'center' : 'space-between',
                  },
                ]}>
                {callerId !== user._id && (
                  <TouchableOpacity
                    style={[styles.btn, {borderColor: color.success}]}
                    onPress={() => {
                      socket.emit('call-accept', callerId);
                      setIsCall(true);
                    }}>
                    <Ionicons name="call" size={35} color={color.success} />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.btn, {borderColor: color.danger}]}
                  onPress={() => {
                    onClose();
                    setIsCall(false);
                    socket.emit('call-cancel', {calleeId, callerId});
                  }}>
                  <Ionicons name="call" size={35} color={color.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  noMargin: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  avatar: {
    height: appSize(100),
    width: appSize(100),
    marginBottom: appSize(10),
    borderRadius: appSize(100),
  },
  nameCaller: {
    fontWeight: 'bold',

    fontSize: appSize(18),
  },
  contentBtn: {
    flexDirection: 'row',
    marginTop: appSize(200),
    width: appSize(200),
    // justifyContent: 'center',
  },
  btn: {
    borderWidth: appSize(1),
    padding: appSize(8),
    borderRadius: appSize(50),
  },
  cameraCaller: {
    position: 'absolute',
    right: 30,
    width: 100,
    height: 200,
    zIndex: 1,
    borderRadius: appSize(10),
    backgroundColor: 'black',
  },
  cameraBackgroundWait: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: appSize(50),
    justifyContent: 'space-between',
  },
});
