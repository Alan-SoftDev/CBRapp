import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import MyUserInfo from './MyUserInfo';

const AUTH_LOGIN = gql`
mutation authLoginUpdate($code: String! $clientID: String! $clientSecret: String!){
    authLogin(code:$code client_id:$clientID client_secret:$clientSecret){
        token
    }
}
`;

const Authorization = (props) => {
    let clientID = "";
    let clientSecret = "";
    const [signIn, setSignIn] = React.useState(false);

    const signOutHandler = () => {
        setSignIn(false);
    }

    const loginClickHandler = () => {
        clientID = prompt("Please enter your CLIENT_ID that you have got from GitHub:", "");
        window.location =
            `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
    }

    const authComplete = (cache, { data }) => {
        localStorage.setItem('token', data.authLogin.token);
        setSignIn(true);
        props.history.replace('/');
    }

    React.useEffect(() => {
        if (window.location.search.match(/code=/)) {
            const code = window.location.search.replace("?code=", "");
            clientID = prompt("Please re-enter your CLIENT_ID that you have got from GitHub:", "");
            clientSecret = prompt("Please enter your CLIENT_SECRET that you have got from GitHub:", "");
            console.log("6" + clientID + '  ' + clientSecret)
            authLogin({ variables: { code, clientID, clientSecret } });
        }
    }, []);

    const [authLogin] = useMutation(AUTH_LOGIN, { update: authComplete });

    return (
        <React.Fragment>
            {
                (signIn) ?
                    <MyUserInfo signOut={signOutHandler} /> :
                    <button className="rightfloat" onClick={loginClickHandler}> Sign in </button>
            }
        </React.Fragment>
    );
}

export default withRouter(Authorization);