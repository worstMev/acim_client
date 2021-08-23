import './index.css';
import React , { Component } from 'react';
import { v4 as uuidV4 } from 'uuid';

/*
 * props:
 * - socket
 * - selectedUser(num_user, username , num_type_user)
 * - session
 * - setNbNewMessageToZero
 */

export default class MessageRoom extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages : [{ id : 'abab' ,
                            sent : true,
                            time_sent : new Date().toLocaleString(),
                            contenu : 'contenu',
                            to : 'destinataire',
                            from : 'envoyeur',
                          },],
            newContenu : '',
            active : this.props.selectedUser.active,
        };
        this.myScroll = React.createRef();
    }

    updateContenu = (e) => {
        //console.log('updateContenu', e.target.value);
        this.setState({
            newContenu : e.target.value,
        });
    }

    sendMessage = (e) => {
        console.log('send message');
        e.preventDefault();
        let {
            session,
            selectedUser,
        } = this.props;
        let {
            newContenu,
            messages,
        } = this.state;
        if( this.state.newContenu && this.props.session && this.props.selectedUser.num_user){
            let id = uuidV4();
            console.log('id' , id)
            let newMessageDisplay = {
                id : id,
                sent : false,
                time_sent : '',
                contenu : newContenu,
                to : selectedUser.username,
                from : session.username,
            };
            let newMessage = {
                id : newMessageDisplay.id,
                contenu : newContenu,
                num_sender : session.num_user,
                receivers : [ selectedUser.num_user ],
            };
            console.log('emit(send message)', newMessage);
            
            this.props.socket.emit('send message' , newMessage);
            let newMessages = messages.slice();
            newMessages.push(newMessageDisplay);
            this.setState({
                messages : newMessages,

            });

        }
    }

    scrollDown = () => {
        const scroll = this.myScroll.current;
        scroll.scrollTop = scroll.scrollHeight;
    }

    componentDidUpdate (prevProps , prevState){
        if( prevProps.selectedUser.num_user !== this.props.selectedUser.num_user ) {
            console.log('emit again');
            this.props.socket.emit('get messages', this.props.session.num_user , this.props.selectedUser.num_user );
        }
    }

    componentDidMount () {
        console.log('MessageRoom mounted');
        
        if( this.props.selectedUser.num_user ) this.props.socket.emit('get messages', this.props.session.num_user , this.props.selectedUser.num_user );

        
        this.props.socket.on('message sent -messageRoom', (ms) => {
            console.log('message sent -messageRoom', ms);
            this.props.socket.emit('get tech_mains list');//update nb new message in activeUsers
            let newMessages = this.state.messages.map(item => {
                if (item.id === ms.num_message ) return { ... item , sent : true ,time_sent : new Date(ms.date_envoie).toLocaleString() };
                else return item;
            });
            //if no ms yet in messages
            if( !this.state.messages.find( msIn => msIn.id === ms.num_message) ) {
                newMessages.push({ 
                    id : ms.num_message , 
                    sent : true,
                    time_sent : new Date(ms.date_envoie).toLocaleString() ,
                    contenu : ms.contenu_message ,
                    from : ms.envoyeur_username ,
                    to : ms.recepteur_username,
                });
            } 
            //console.log('newMessages',newMessages);
            this.setState({
                messages : newMessages,
                newContenu : '',
            });
            this.scrollDown();
        });

        this.props.socket.on('messages -messageRoom', (messages)=>{
            console.log('messages -messageRoom',messages);
            if(messages){
                let newMessages = messages.map( ms => {
                    let seen = false;
                    if( ms.date_reception ) {
                        ms.date_reception = new Date( ms.date_reception ).toLocaleString('FR-fr');
                        seen = true;
                    }
                    return ({
                        id : ms.num_message ,
                        sent : true,
                        time_sent : new Date(ms.date_envoie).toLocaleString(),
                        time_seen : ms.date_reception,
                        seen,
                        contenu : ms.contenu_message,
                        to : ms.recepteur_username,
                        from : ms.envoyeur_username,
                    });
                });
                console.log('newMessages +' , newMessages);
                this.setState({
                    messages : newMessages,
                });
                this.scrollDown();
                this.clickOnMessageRoom();
            }

        });

        this.props.socket.on('new message -messageRoom' , (ms) => {
            console.log('new message -messageRoom', ms);
            let {
                selectedUser,
                session,
            } = this.props;
            this.props.socket.emit('get tech_mains list');//update nb new message in activeUsers
            
            if( this.props.selectedUser.num_user === ms.num_app_user_envoyeur){
                let newMs = {
                    id : ms.num_message,
                    time_sent : new Date(ms.date_envoie).toLocaleString(),
                    contenu : ms.contenu_message,
                    sent : true,
                    tim_seen : ms.date_reception,
                    seen : false,
                    from : ms.envoyeur_username,
                    to : ms.recepteur_username,
                };
                console.log(newMs);
                let newMessages = this.state.messages.slice();
                newMessages.push(newMs);
                this.setState({
                    messages : newMessages,
                });
                this.scrollDown();
            }
        });

        this.props.socket.on('updateMessages -messageRoom', (updatedMessages) => {
            console.log('updateMessage -messageRoom' , updatedMessages);
            let newMessages = this.state.messages.slice();
            let updatedMessagesId = updatedMessages.map( ms => ms.num_message);
            console.log('updatedMessagesId' , updatedMessagesId);
            //update the message with the id = num_message
            newMessages = newMessages.map( ms =>{
                let indexInUpdateMessage = updatedMessagesId.findIndex(id => id === ms.id);//assuming that updateMessagesId maps perfectly updateMessage
                console.log('indexInUpdateMessage', indexInUpdateMessage);
                if( indexInUpdateMessage !== -1 ){
                    let seen = !!(updatedMessages[indexInUpdateMessage].date_reception);
                    return ({
                        ... ms,
                        time_seen : new Date(updatedMessages[indexInUpdateMessage].date_reception).toLocaleString('fr-FR'),
                        seen,
                    });
                }else{
                    return ms;
                }
            });

            console.log('newMessages' , newMessages);
            this.props.socket.emit('get nb new message', this.props.session.num_user);//update nb new message of main
            this.props.socket.emit('get tech_mains list');
            this.setState({
                messages : newMessages,
            });
        });
    }

    

    componentWillUnmount () {
        console.log('MessageRoom unmount');
        this.props.socket.off('message sent -messageRoom');
        this.props.socket.off('messages -messageRoom');
        this.props.socket.off('new message -messageRoom');
        this.props.socket.off('updateMessages -messageRoom');
    }

    clickOnMessageRoom = () => {
        console.log('clickOnMessageRoom');
        //make all message seen;
        console.log('clickOnMessageRoom state.message', this.state.messages);
        let unseenMessagesByMe = this.state.messages.filter( ms => !ms.seen && !ms.time_seen && ms.to === this.props.session.username );
        console.log('unseenMessagesByMe', unseenMessagesByMe);
        if( unseenMessagesByMe.length > 0) this.props.socket.emit('tech_main saw messages', unseenMessagesByMe);
    };

    render () {
        let {
            messages,
            newContenu,
        } = this.state;
        let {
            selectedUser,
            session,
        } = this.props;

        let messagesElements = messages.map( ms => 
            <MessageElement key={ms.id}
                message = {ms}
                session = {session}
                />
        );
        let display;
        if(selectedUser.num_user){
            display = (
                <>
                    <div className= "header-messageRoom">
                        <p> {selectedUser.username} {(selectedUser.active) ? '[connecté]' : '[non-connecté]' } </p>
                    </div>
                    <div className= "main-messageRoom">
                        <div className="scroll_list" ref={this.myScroll}>
                            {messagesElements}
                        </div>
                        <div className="input-messageRoom">
                            <form onSubmit={this.sendMessage}>
                                <input value = {newContenu} type="text" placeholder="Ecrire ici" onChange={this.updateContenu} />
                                <button onClick={this.sendMessage}> envoyer </button>
                            </form>
                        </div>
                    </div>
                </>
            );

        }else{
            display = (
                    <div className= "header-messageRoom">
                        <p> aucun technicien selectionné </p>
                    </div>
            );
        }
        
        return (
            <div className= "messageRoom" onClick={this.clickOnMessageRoom}>
                { display }
            </div>
        );
    }
}

function MessageElement (props) {
    /*
     * props:
     * - ms { id , contenu , to , from ,sent , time_sent }
     * - session
     */
    let {
        message,
        session,
    } = props;
    let isSelf = (session.username === message.from);
    let style ;
    let divStyle ;
    let display;
    let fromDisplay = (
            <p className="from-message"> {message.from} : </p>
    );
    let indication = (
        <div className="indication-message">
            <p> { (message.sent) ? `envoyé le ${message.time_sent}` : '' } </p>
            <p> { (message.seen) ? `reçue le ${message.time_seen}` : 'non-reçue' } </p>
        </div>
    );
    let contenu = (diStyle) => (
        <div  className="contenu-message" style={divStyle}>
            {fromDisplay}
            <p> {message.contenu}  </p>
        </div>
    );
    if(isSelf){
        //is Me
        style = {
            color : 'red',
            justifyContent : 'flex-end',
        };
        divStyle = {
            margin : '5px 0 5px 5px',
            borderLeft : '1px solid grey',
        }
        display = (
            <>
                {indication}
                {contenu(divStyle)}
            </>
        );

    }else{
        //not Me
        style = {
            color : 'black',
            justifyContent : 'flex-start',
        };
        divStyle = {
            margin : '5px 5px 5px 0',
            borderRight : '1px solid grey',
        }
        display = (
            <>
                {contenu(divStyle)}
                {indication}
            </>
        );
    }
    return (
        <div className ="messageElement" style={style}>
            {display}
        </div>
    );
}
