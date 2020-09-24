import React, { Component } from 'react';
import Routes from './Routes';
import { ApolloProvider } from '@apollo/client';

export const MyContext = React.createContext({
    tokeni: null,
    name: null,
    setTokeni: ()=>{},
    setName: ()=>{}

});

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tokeni: null,
            name: null
        };
    }

    setTokeni = (tokeni) => {
        this.setState({ tokeni });
    };

    setName = (name) => {
        this.setState({ name });
    };

    render() {
        const context = {
            tokeni: this.state.tokeni,
            name: this.state.name,
            setTokeni: this.setTokeni,
            setName: this.setName
        };
        return (
            <ApolloProvider client={this.props.client}>
                <MyContext.Provider value={ context }>
                    <Routes />
                </MyContext.Provider>
            </ApolloProvider>
        );
    }
}

export default App;