import { io } from 'socket.io-client';

const socket = io('http://localhost:3500', {
	autoConnect : false ,
});

socket.onAny((event , ...args) => {
    console.log(`-- ${event} `, args);
});

export const mySocket = {
    socket ,
    connect : (username , type_user , num_user) => {
        console.log( username , type_user , num_user );
        //connect socket
        console.log(socket);
        socket.auth = {
            username,
            type_user,
            num_user,
        };
        socket.connect();
    },
    disconnect : () => {
        console.log('my socket disconnect ');
        socket.offAny();
        socket.disconnect();
    }
}
