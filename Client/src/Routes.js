import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from "react-router-dom";
import HeaderAndNavigation from "./HeaderAndNavigation";
import Home from "./Home";
import BookSearch from "./BookSearch";
import Reviews from "./Reviews";
import { MyContext } from "./App";

function Routes() {
    return (
        <Router>
            <div>
                <HeaderAndNavigation />
                <MyContext.Consumer>
                    {context => (<Switch>
                        <Redirect exact={true} from="/" to="/Home" />
                        <Route path="/Home" component={Home} />
                        <Route path="/BookSearch">{!!context.name ? <BookSearch /> : <Redirect to="/Home" />}</Route>
                        <Route path="/Reviews">{!!context.name ? <Reviews /> : <Redirect to="/Home" />}</Route>
                    </Switch>
                    )}
                </MyContext.Consumer>
            </div>
        </Router>
    );
}

export default Routes;
