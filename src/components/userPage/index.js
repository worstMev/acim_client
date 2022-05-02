import './index.css';
import React , { Component } from 'react';
import DropDown from './../utils/dropDown';

export default class UserPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            oldUsername : '',
            username : '',
            pwd : '',
            secondPwd : '',
            nowPwd : '',
            listTypeUser : [],
            codeTypeUser : '',//look for beforeInsert() in database : trigger function
            num_user : '',
            changePwd : false,
        };
    }

    updateUsername = (e) => {
        //console.log('update username');
        this.setState({
            username : e.target.value,
        });
    }

    updatePwd = (e) => {
        //console.log('update pwd');
        this.setState({
            pwd : e.target.value,
        });
    }

    updateTypeUser = (e) => {
        //console.log('updateTypeUser ', e.target.value);
        this.setState({
            codeTypeUser : e.target.value,
        });
    }

    createUser = () => {
        let { 
            username ,
            pwd , 
            secondPwd ,
            codeTypeUser ,
            num_user,
        } = this.state;

        if( username !== '' 
            && pwd !== ''
            && secondPwd !== ''
            && codeTypeUser !== ''
            && num_user === ''
            && pwd === secondPwd ) {
            console.log('create a new user' , username , pwd , codeTypeUser);
            this.props.socket.emit('create user', username , pwd , codeTypeUser);
        }
    }

    updateUser = () => {
        let { 
            oldUsername,//security
            username , //updatable
            pwd ,  //updatable
            secondPwd , 
            nowPwd, //security
            codeTypeUser , //updatable
            num_user,
            changePwd,
        } = this.state;
        if( num_user && username ){
            let data = { num_user , nowPwd , username , codeTypeUser , oldUsername};
            console.log('update user', data);
            if(changePwd) {
                if ( pwd && pwd === secondPwd){
                    data = { ... data , pwd }
                    this.props.socket.emit('update user', data);
                }else{
                    console.log('pwd and secondPwd not the same');
                }
            } else {
                console.log('no changePwd , but update');
                this.props.socket.emit('update user',data);
            }

        }

    }
    

    componentDidMount() {
        //get data if a num_user if provided
        //get
        this.props.socket.emit('get list type_user');
        this.props.socket.on('list type_user', (listTypeUser) => {
            console.log('listTypeUser' , listTypeUser);
            let newListTypeUser = listTypeUser.map(el => ({
                key : el.num_type_user,
                value : el.code,
                libelle : el.libelle,
            }));

            this.setState({
                listTypeUser : newListTypeUser,
                codeTypeUser : newListTypeUser[0].value,
            });
        });

        this.props.socket.on('update list app_user' , () => {
            console.log('user created');
            this.props.history.goBack();
        });

        this.props.socket.on('error creating user' , () => {
            console.log('error creating user');
        });


        

        if(this.props.location.state){
            let {
                num_user,
            }= this.props.location.state;
            //get the data from num_user
            console.log('get data for user ', num_user);
            this.props.socket.emit('get user data', num_user);
            this.props.socket.on('user data', (userData) => {
                console.log('userData', userData);
                if( num_user === userData.num_user){
                    this.setState({
                         oldUsername : userData.username,
                         username : userData.username,
                         codeTypeUser : userData.code,
                         num_user : userData.num_user,
                    });
                }
            });
        }
    }

    componentWillUnmount(){
        console.log('UserPage unmount');
        this.props.socket.off('list type_user');
        this.props.socket.off('update list app_user');
        this.props.socket.off('error creating user');
        this.props.socket.off('user data');
    }
    render(){
        let { 
            username ,
            pwd ,
            secondPwd ,
            nowPwd,
            changePwd,
            listTypeUser,
            codeTypeUser,
            num_user,
        } = this.state;
        let pwdVerified = ( pwd === secondPwd ) && ( pwd !== '' ) && ( username !== '' ) && ( codeTypeUser !== '') && (num_user === '');
        let showDoublePwdInput = (!num_user || changePwd);
        
        return (
            <div className="userPage">
                <label> Pseudo :
                    <input type="text" value={username} onChange = { this.updateUsername } />
                </label>
                <label> Type :
                    <DropDown objArray = {listTypeUser} onChange={ this.updateTypeUser } value = {codeTypeUser} />
                </label>
                { showDoublePwdInput &&
                    <>
                    <label> Nouveau mot de passe :
                        <input type="password" value={pwd} onChange = { this.updatePwd } />
                    </label>
                    <label> Confirmez le nouveau mot de passe :
                        <input type="password" value={secondPwd} onChange = { (e) => this.setState({ secondPwd : e.target.value })}/>
                    </label>
                    </>
                }
                { num_user &&
                    <>
                    <label> { changePwd && 'Ancien ' }mot de passe  :
                        <input type="password" value={nowPwd} onChange = { (e) => this.setState({ nowPwd : e.target.value })}/>
                    </label>
                    <label> Changer le mot de passe:
                        <input type="checkbox" value={changePwd} onChange= { (e) => this.setState({ changePwd : e.target.checked })}/>
                    </label>
                    <button onClick = {this.updateUser}> Enregistrer </button>
                    <button onClick = {this.deleteUser}> Supprimer </button>
                    </>
                }
                { pwdVerified &&
                    <button onClick = {this.createUser}> Creer </button>
                }
            </div>
        );
    }
}
