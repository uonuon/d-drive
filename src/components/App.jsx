import React, { Component } from 'react';
import Profile from './Profile.jsx';
import Signin from './Signin.jsx';
import Notifications from 'react-notify-toast';
import {
    UserSession,
    AppConfig
} from 'blockstack';
import { configure, User } from 'radiks';

const appConfig = new AppConfig()
const userSession = new UserSession({ appConfig: appConfig });
configure({
    apiServer: 'http://localhost:8000',
    userSession
});

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    }

    handleSignIn(e) {
        e.preventDefault();
        this.setState({ isLoading: true });
        userSession.redirectToSignIn();
    }

    handleSignOut(e) {
        e.preventDefault();
        userSession.signUserOut(window.location.origin);
    }

    render() {
        return (
            <div className="site-wrapper">
                <div style={{ fontSize: '2rem' }}>
                    <Notifications options={{ zIndex: 2000, wrapperId: 'notificationsWrapper' }} />
                </div>
                <div className="site-wrapper-inner">
                    {!userSession.isUserSignedIn() ?
                        <Signin userSession={userSession} isLoading={this.state.isLoading} handleSignIn={this.handleSignIn} />
                        : <Profile userSession={userSession} handleSignOut={this.handleSignOut} />
                    }
                </div>
            </div>
        );
    }

    async componentWillMount() {
        if (!userSession.isUserSignedIn() && userSession.isSignInPending()) {
            this.setState({ isLoading: true });
            await userSession.handlePendingSignIn()
            User.createWithCurrentUser().then((userData) => {
                window.location = window.location.origin;
                this.setState({ isLoading: false });
            });
        }
    }
}
