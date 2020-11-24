import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import MyUserInfo from './MyUserInfo';

const AUTH_LOGIN = gql`
mutation authLoginUpdate($code: String!){
    authLogin(code:$code){
        token
    }
}
`;

const Authorization = (props) => {
    const [signIn, setSignIn] = React.useState(false);

    const signOutHandler = () => {
        setSignIn(false);
    }

    const loginClickHandler = () => {
        const clientID = <Github Client ID>;
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
            authLogin({ variables: { code } });
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