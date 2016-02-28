import './Login.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { firebaseActions } from '../../common/lib/redux-firebase';
import { replace } from 'react-router-redux';

class Login extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    msg: PropTypes.object.isRequired,
    resetPassword: PropTypes.func.isRequired,
    signUp: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onSocialLoginClick = this.onSocialLoginClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSignUpClick = this.onSignUpClick.bind(this);
    this.toggleForgetPassword = this.toggleForgetPassword.bind(this);
    this.onResetPasswordClick = this.onResetPasswordClick.bind(this);
    // Note we deliberately use component state, because we don't want to
    // preserve this piece of state when the user leaves a page.
    this.state = {
      forgetPasswordIsShown: false,
      recoveryEmailSent: false
    };
  }

  toggleForgetPassword() {
    this.setState(({ forgetPasswordIsShown }) => ({
      forgetPasswordIsShown: !forgetPasswordIsShown
    }));
  }

  async redirectOnSuccess(action) {
    const result = await action.payload.promise;
    if (result.error) return;
    const { location, replace } = this.props;
    const nextPathname = location.state && location.state.nextPathname || '/';
    replace(nextPathname);
  }

  onSocialLoginClick(e) {
    const { provider } = e.target.dataset;
    const { fields, login } = this.props;
    this.redirectOnSuccess(login(provider, fields.$values()));
  }

  onFormSubmit(e) {
    e.preventDefault();
    const { fields, login } = this.props;
    this.redirectOnSuccess(login('password', fields.$values()));
  }

  onSignUpClick() {
    const { fields, signUp } = this.props;
    this.redirectOnSuccess(signUp(fields.$values()));
  }

  async onResetPasswordClick() {
    const { fields, resetPassword } = this.props;
    const { email } = fields.$values();
    const result = await resetPassword(email).payload.promise;
    if (result.error) return;
    this.setState({
      forgetPasswordIsShown: false,
      recoveryEmailSent: true
    });
  }

  render() {
    const { auth, fields, msg } = this.props;
    const { forgetPasswordIsShown, recoveryEmailSent } = this.state;

    return (
      <div className="row">
        <div className="col-md-8">
          <div className="firebase-login">
            <p>{msg.loginInfo}</p>
            <div className="social-auth-providers">
              <button
                className="btn btn-primary"
                data-provider="facebook"
                disabled={auth.formDisabled}
                onClick={this.onSocialLoginClick}
              >{msg.facebookLogin}</button>
            </div>
            {/* https://github.com/steida/vetoapp/issues/8 */}
            <form onSubmit={this.onFormSubmit}>
              <fieldset className="form-group" disabled={auth.formDisabled}>
                {!this.state.forgetPasswordIsShown ?
                  <legend>{msg.emailLoginSignup}</legend>
                :
                  <legend>{msg.forgotPassword}</legend>
                }
                <small className="text-muted">{msg.emailIsSecret}</small>
                <input
                  className="form-control"
                  maxLength="100"
                  placeholder="your@email.com"
                  {...fields.email}
                />
                {!forgetPasswordIsShown &&
                  <input
                    className="form-control"
                    disabled={forgetPasswordIsShown}
                    maxLength="1000"
                    placeholder="password"
                    type="password"
                    {...fields.password}
                  />
                }
                {!forgetPasswordIsShown ?
                  <div className="buttons">
                    <button
                      className="btn btn-primary btn-sm"
                    >{msg.login}</button>{' '}
                    <button
                      className="btn btn-success btn-sm"
                      onClick={this.onSignUpClick}
                      type="button"
                    >{msg.signUp}</button>{' '}
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={this.toggleForgetPassword}
                      type="button"
                    >{msg.forgotPassword}</button>
                  </div>
                :
                  <div className="buttons">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={this.onResetPasswordClick}
                      type="button"
                    >{msg.resetPassword}</button>{' '}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={this.toggleForgetPassword}
                      type="button"
                    >{msg.dismiss}</button>
                  </div>
                }
              </fieldset>
            </form>
            {auth.formError &&
              <div className="alert alert-danger" role="alert">
                {/* TODO: Localize. */}
                {auth.formError.message}
              </div>
            }
            {recoveryEmailSent &&
              <div className="alert alert-success" role="alert">
                {msg.recoveryEmailHasBeenSent}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}

Login = fields(Login, {
  path: 'auth',
  fields: ['email', 'password']
});

export default connect(state => ({
  auth: state.auth,
  msg: state.intl.msg.auth
}), { ...firebaseActions, replace })(Login);
