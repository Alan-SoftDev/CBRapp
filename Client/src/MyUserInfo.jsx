import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { withApollo } from '@apollo/react-hoc';
import { MyContext } from './App';

const ME = gql`query { me { name } }`;

const MyUserInfo = (props) => {

    const context = useContext(MyContext);

    const { data } = useQuery(ME, { fetchPolicy: "network-only" });

    const logout = () => {
        localStorage.removeItem('token');
        let data1 = props.client.readQuery({ query: ME });
        let data2 = {...data1, me: null};
        props.client.writeQuery({ query: ME, data2 });
        props.signOut();
        context.setTokeni(null);
        context.setName(null);
    }


    React.useEffect(() => {
        if (context.tokeni !== localStorage.getItem('token')) {
            context.setTokeni(localStorage.getItem('token'));
        }
    }, [context.setTokeni]);

    React.useEffect(() => {
        if (!!data) {
            context.setName(data.me.name);    
        }
    },[data]);


    return (
        <div className="dropdown">
            <button className="dropbtn"> User: {context.name}</button>
            <div className="dropdown-content">
                <a onClick={logout}> Sign out</a>
            </div>
        </div>
    );
}

export default withApollo(MyUserInfo);