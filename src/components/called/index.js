import './index.css';
import React , { Component } from 'react';
import ringtone from './../../res/son/ringtone.wav';

/*
 * props:
 * - caller : username , num_user, call 
 * - onClose
 * -socket
 *  - peer
 */

export default class Called extends Component {

    constructor(props){
        super(props);
        this.state = {
            callOk : this.props.callOk || false,
            isConnected : false,
            micIsOk : false,
            indic : '',
        }
        this.myAudioStream = null;
        this.monitorConn = null;
        this.ringtone = new Audio(ringtone);
    }

    acceptCall = () => {
        let { micIsOk, isConnected } = this.state;
        let { peer , caller } = this.props;
        let { call } = caller;
        console.log('accept call ', call);
        //create myAudioStream
        
        console.log( 'micIsOk , isConnected ' , micIsOk , isConnected);
        if(micIsOk && isConnected) {
            this.ringtone.pause();
            navigator.mediaDevices.getUserMedia({audio : true})
                .then((stream) =>{
                    this.myAudioStream = stream;
                    console.log('called Stream', this.myAudioStream);
                    call.answer(this.myAudioStream);
                    this.monitorConn.send('Connecté');
                    //establish a peer dataconnection
                    //call.peer is peer id of caller , and it is unique so one possibility th peer in caller


                    
                   
                    call.on('stream' , (streamBack) => {
                        let audio = new Audio();
                        audio.srcObject = streamBack;
                        audio.play();
                        console.log('accept this stream', streamBack);
                        console.log('caller Stream', streamBack);
                        //console.log( 'streamBack tracks ', streamBack.getTracks());
                        this.setState({
                            callOk : true,
                            indic : 'connecté !'
                        });
                    });
                    call.on('close', () => {
                        console.log('close the call in callED');
                        console.log('fin appel de', this.props.caller.username);
                        console.log('stop stream' ,this.myAudioStream);
                        this.myAudioStream.getTracks().forEach(track => track.stop());
                        this.props.caller.call.close();
                        //suppress the called
                        this.setState({
                            callOk : false,
                        });
                        this.monitorConn.close();
                    });
                    call.on('error' , () => {
                        console.log('error in call');
                    });
                })
                .catch((err)=>{
                    console.log('error navigator.mediaDevices.getUserMedia in called', err);
                    this.setState({
                        micIsOk : false,
                        indic : 'reception uniquement',
                    });

                    this.monitorConn.send('Connecté ,le micro du recepteur ne marche pas');
                    
                    //one way communication
                    call.answer();
                    //establish a peer datathis.monitorConnection
                    //call.peer is peer id of caller , and it is unique so one possibility th peer in caller

                    
                   
                    call.on('stream' , (streamBack) => {
                        let audio = new Audio();
                        audio.srcObject = streamBack;
                        audio.play();
                        console.log('accept this stream', streamBack);
                        console.log('caller Stream', streamBack);
                        //console.log( 'streamBack tracks ', streamBack.getTracks());
                        this.setState({
                            callOk : true,
                        });
                    });
                    call.on('close', () => {
                        console.log('close the call in callED');
                        console.log('fin appel de', this.props.caller.username);
                        console.log('stop stream' ,this.myAudioStream);
                        if(this.myAudioStream) this.myAudioStream.getTracks().forEach(track => track.stop());
                        this.props.caller.call.close();
                        //suppress the called
                        this.setState({
                            callOk : false,
                        });
                        this.monitorConn.close();
                    });
                    call.on('error' , () => {
                        console.log('error in call');
                    });
                });
                
        }else{
            if(!micIsOk){
                console.log('no mic');
                this.ringtone.pause();
                this.setState({
                    micIsOk : false,
                    indic : 'reception uniquement',
                });

                this.monitorConn.send('Connecté ,le micro du recepteur ne marche pas');
                
                //one way communication
                call.answer();
                //establish a peer datathis.monitorConnection
                //call.peer is peer id of caller , and it is unique so one possibility th peer in caller

                
               
                call.on('stream' , (streamBack) => {
                    let audio = new Audio();
                    audio.srcObject = streamBack;
                    audio.play();
                    console.log('accept this stream', streamBack);
                    console.log('caller Stream', streamBack);
                    //console.log( 'streamBack tracks ', streamBack.getTracks());
                    this.setState({
                        callOk : true,
                    });
                });
                call.on('close', () => {
                    console.log('close the call in callED');
                    console.log('fin appel de', this.props.caller.username);
                    console.log('stop stream' ,this.myAudioStream);
                    if(this.myAudioStream) this.myAudioStream.getTracks().forEach(track => track.stop());
                    this.props.caller.call.close();
                    //suppress the called
                    this.setState({
                        callOk : false,
                    });
                    this.monitorConn.close();
                });
                call.on('error' , () => {
                    console.log('error in call');
                });
            }
        }
        
        
    }

    stopCall = () => {
        console.log('fin appel de', this.props.caller.username);
        console.log('stop stream' ,this.myAudioStream);
        if(this.myAudioStream) this.myAudioStream.getTracks().forEach(track => track.stop());
        this.props.caller.call.close();
        this.ringtone.pause();
        //like closing the call
        this.close();
        //suppress the called
        this.setState({
            callOk : false,
            indic : '',
        });
    }


    detectMic = async () => {
        try{
            if( navigator.mediaDevices ){
                let devices = await navigator.mediaDevices.enumerateDevices();
                console.log('devices',devices);
                let micIsOk = (devices.find(item => item.kind === 'audioinput')) ? true : false;
                console.log('detectMic micIsOk', micIsOk);
                this.setState({
                    micIsOk,
                });
            }else{
                
            }
        }catch(err){
            console.log('error in detectMic :',err);
            this.setState({
                micIsOk : false,
            });
        }
    }

    componentDidMount = async () => {
        console.log('called mounted');
        let { peer , caller } = this.props;
        let { call } = caller;
        //check for micro
        await this.detectMic();
        this.props.socket.emit('get list tech_main connected');//returns num_user of any user not just tech_main
        if (call) this.ringtone.play();
        //createa  monitoring connection
        this.monitorConn = peer.connect( caller.call.peer , { label : 'audio', metadata : {peerId : peer.id} });
        this.monitorConn.on('close',()=>{
            //rejecting from tech
            console.log('called this.monitorConn close');
            this.close();
            call.close();
        });

        this.monitorConn.on('error' , (err) => {
            console.log('monitorConn error' ,err);
            this.ringtone.pause();
        });

        this.props.socket.on('tech_main connected list -called', (connectedUsers) => {
            console.log('tech_main connected list -called', connectedUsers);
            let isConnected = connectedUsers.includes(this.props.caller.num_user);
            this.setState({
                isConnected,
            });
        });
        
    }

    componentWillUnmount(){
        console.log('called unmount');
        this.props.socket.off('tech_main connected list -called');
        if(this.myAudioStream) this.myAudioStream.getTracks().forEach(track => track.stop());
        this.props.caller.call.close();
        this.ringtone.pause();
    }

    close = () => {
        //close the called component
        console.log('close called');
        this.monitorConn.close();
        this.props.onClose();
    }

    render(){
        let {
            micIsOk,
            callOk,
            isConnected,
            indic,
        } = this.state;
        let {
            caller,
        } = this.props;

        let button = (<button onClick={this.stopCall}> Raccrocher </button>) ;
        if(!callOk){
            button =(<button onClick={this.acceptCall}> Accepter </button>);
        }
        
        return(
            <div className="called">
                <p> Appel de {caller.username}</p>
                <p> micro : {(micIsOk) ? 'OK' : 'probleme !!'} </p>
                <p> { indic } </p>
                <div className="control">
                    {button}
                    <button onClick={this.close}> x </button>
                </div>
            </div>
        );
    }
}
