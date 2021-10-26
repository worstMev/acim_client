import './index.css';
import React , { Component  } from 'react';
import Peer from 'peerjs';


/*
 * props:
 * -userToCall : { num_user , username }
 * - deleteFromListToCall
 * - socket 
 * - session
 */

export default class Caller extends Component {
    constructor(props){
        super(props);
        this.state = {
            peerIds : [],
            isCalling : false,
            isConnected : false,
            micIsOk : false,
            indic : '',
        }
        this.myPeer = null ;
        this.myCalls = {};
        this.myAudioStream = null;
    }
    startCall = () => {
        let { session  , userToCall } = this.props;
        let { peerIds } = this.state;
        let {
            num_user,
            username,
        } = userToCall;
        if(!this.state.isConnected || this.state.peerIds.length < 1 ){
            this.setState({
                indic : 'utilisateur non-connecté !!',
            });
        }

        if(this.state.micIsOk && this.state.isConnected && this.state.peerIds.length){
            console.log('call peer ', num_user);
            //caller can have any id
            this.myPeer = new Peer( undefined, {
                host : '/',
                path : '/peer/acim',
                port : 3550,
            });
            this.myPeer.on('open' , (id) => {
                console.log('connected to peerServer id ', id);
            });

            this.myPeer.on('connection' , (calledConn) => {
                console.log('connection data label ', calledConn.label);
                this.setState({
                    indic : '... sonne',
                });
                this.myCalls[calledConn.metadata.peerId].monitorConn = calledConn;
                this.myCalls[calledConn.metadata.peerId].monitorConn.on('close', () => {
                    console.log('close calledConn  ', this.myCalls[calledConn.metadata.peerId].monitorConn.label);
                    this.myCalls[calledConn.metadata.peerId].call.close();
                    delete this.myCalls[calledConn.metadata.peerId];
                    if( Object.keys(this.myCalls).length < 1){
                        this.myAudioStream.getTracks().forEach(track => track.stop());
                        this.setState({
                            isCalling : false,
                            indic : 'deconnecté !',
                        });
                    }
                });
                this.myCalls[calledConn.metadata.peerId].monitorConn.on('data',(msg) => {
                    this.setState({
                        indic : msg,
                    });
                });
            });

            this.myPeer.on('error' , (err) => {
                console.log('caller this.myPeer error' , err);
                this.setState({
                    indic : 'Erreur',
                });
            });
            navigator.mediaDevices.getUserMedia({ audio : true })
                .then((stream) => {
                    this.myAudioStream = stream;
                    console.log('caller Stream', this.myAudioStream);
                    let metadata = {
                        username : session.username,
                        num_user : session.num_user,
                    };
                    for( const peerId of peerIds){
                        this.myCalls[peerId] = {};
                        this.myCalls[peerId].call = this.myPeer.call(peerId , this.myAudioStream ,{metadata : metadata});
                        this.setState({
                            isCalling : true,
                            indic : 'connexion ...'
                        });
                        this.myCalls[peerId].call.on('stream' , (streamBack) => {
                            let audio = new Audio();
                            audio.srcObject = streamBack;
                            audio.play();
                            console.log('accept this stream', streamBack);
                            console.log('called Stream', streamBack);


                            this.setState({
                                indic : 'connecté !',
                            });
                        });
                        this.myCalls[peerId].call.on('error' , () => {
                            console.log('error in call');
                        });

                        this.myCalls[peerId].call.on('close' , () => {
                            console.log('close the call in caller');
                            this.myAudioStream.getTracks().forEach(track => track.stop());
                            //this.setState({
                            //    indic : 'deconnecté !',
                            //    isCalling : false,
                            //});
                        });
                    }
                    
                    this.myPeer.on('disconnected' , () => {
                        stream.getTracks().forEach( track => track.stop());
                    });


                });
        }

    }

    stopCall = () => {
        //stop everything
        console.log('stop stream' ,this.myAudioStream , this.myCalls);
        
        this.myAudioStream.getTracks().forEach(track => track.stop());
        for ( const peerId of this.state.peerIds ) {
            console.log('stop stream for peer ', peerId);
            if( this.myCalls[peerId].monitorConn ) this.myCalls[peerId].monitorConn.close();
            //if( this.myCalls[peerId].call ) this.myCalls[peerId].call.close(); NOT NEEDED monitorConn.close closes calls
        }
        this.myPeer.disconnect();
        this.setState({
            isCalling : false,
            indic : '',
        });
    }

    detectMic = async () => {
        try{
            let devices = await navigator.mediaDevices.enumerateDevices();
            console.log('devices',devices);
            let micIsOk = (devices.find(item => item.kind === 'audioinput')) ? true : false;
            this.setState({
                micIsOk,
            });
        }catch(err){
            console.log(err);
            this.setState({
                micIsOk : false,
            });
        }
    }

    componentDidMount = async () => {
        console.log('caller mounted');
        //check for micro
        await this.detectMic();
        this.props.socket.emit('get list tech_main connected');//returns num_user of any user not just tech_main
        this.props.socket.on('peer id',(peerIds) => {
            console.log('peerIds', peerIds);
            this.setState({
                peerIds : peerIds,
            });
        });

        this.props.socket.on('tech_main connected list -caller', (connectedUsers) => {
            let isConnected = connectedUsers.includes(this.props.userToCall.num_user);
            console.log('tech_main connected list -caller');
            setTimeout(() => {
                this.props.socket.emit('get peer id', this.props.userToCall.num_user);
            }, 2000);//wait for client to register peer id in in server 
            this.setState({
                isConnected,
            });
        });
        
    }

    componentWillUnmount(){
        console.log('caller unmount');
        if(this.myPeer) this.myPeer.destroy();
        this.props.socket.off('tech_main connected list -caller');
        this.props.socket.off('peer id');
        if(this.calledConn) this.calledConn.close();//reject from caller
    }

    render () {
        let { userToCall } = this.props;
        let {
            peerIds,
            isCalling,
            micIsOk,
            isConnected,
            indic,
        } = this.state;
        let {
            username ,
            num_user ,
        } = userToCall;
        isConnected = (isConnected && peerIds.length);
        let button = (<button className="myButton green" onClick = {this.startCall}> Appeler </button>);
        if (isCalling) button = (<button className="myButton" onClick = {this.stopCall}> Raccrocher </button>);
        return (
            <div className= "caller">
                <p> Appeler : {username} {(isConnected)? 'est connecté' : 'est hors-connexion'} </p>
                <p> micro : {(micIsOk) ? 'OK' : 'probleme !!'} </p>
                <p> {indic} </p>
                <div className="control">
                    {button}
                    <button onClick = {()=> this.props.deleteFromListToCall(userToCall)}> x </button>
                </div>
            </div>
        );
    }
}
