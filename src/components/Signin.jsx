import React, { Component } from 'react';
import { ClipLoader } from "react-spinners";

export default class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="panel-landing" id="section-1">
        <h1 className="landing-heading">Hello, Cairo Blockstack!</h1>
        <p className="lead">
          {!this.props.isLoading ? <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            onClick={handleSignIn.bind(this)}
          >
            Sign In with Blockstack
          </button> :
          <ClipLoader
            sizeUnit={"px"}
            size={20}
            color={'white'}
            loading={true}
          />}
        </p>
      </div>
    );
  }
}
