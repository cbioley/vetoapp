import './Login.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { firebaseActions } from '../../common/lib/redux-firebase';
import { replace } from 'react-router-redux';

const messages = defineMessages({
  facebookLogin: {
    defaultMessage: 'Login via Facebook',
    id: 'firebase.login.facebookLogin'
  },
  emailLoginSignup: {
    defaultMessage: 'Email Login / Sign Up',
    id: 'firebase.login.emailLoginSignup'
  },
  forgotPassword: {
    defaultMessage: 'Forgot Password',
    id: 'firebase.login.forgotPassword'
  },
  login: {
    defaultMessage: 'Login',
    id: 'firebase.login.login'
  },
  signUp: {
    defaultMessage: 'Sign Up',
    id: 'firebase.login.signUp'
  },
  resetPassword: {
    defaultMessage: 'Reset Password',
    id: 'firebase.login.resetPassword'
  },
  dismiss: {
    defaultMessage: 'Dismiss',
    id: 'firebase.login.dismiss'
  },
  recoveryEmailHasBeenSent: {
    defaultMessage: 'Password reset email sent successfully!',
    id: 'firebase.login.recoveryEmailHasBeenSent'
  },
});

class Login extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
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

  onSocialLoginClick(provider) {
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

  async redirectOnSuccess(action) {
    const result = await action.payload.promise;
    if (result.error) return;
    const { location, replace } = this.props;
    const nextPathname = location.state && location.state.nextPathname || '/';
    replace(nextPathname);
  }

  toggleForgetPassword() {
    this.setState(({ forgetPasswordIsShown }) => ({
      forgetPasswordIsShown: !forgetPasswordIsShown
    }));
  }

  render() {
    const { auth, fields } = this.props;
    const { forgetPasswordIsShown, recoveryEmailSent } = this.state;

    return (
      <div className="row">
        <div className="col-md-8">
          <div className="firebase-login">
            <div className="social-auth-providers">
              <button
                className="btn btn-primary"
                disabled={auth.formDisabled}
                onClick={() => this.onSocialLoginClick('facebook')}
              ><FormattedMessage {...messages.facebookLogin} /></button>
            </div>
            {/* https://github.com/steida/vetoapp/issues/8 */}
            <form onSubmit={this.onFormSubmit}>
              <fieldset className="form-group" disabled={auth.formDisabled}>
                <legend>
                  {!this.state.forgetPasswordIsShown ?
                    <FormattedMessage {...messages.emailLoginSignup} />
                  :
                    <FormattedMessage {...messages.forgotPassword} />
                  }
                </legend>
                <input
                  className="form-control"
                  maxLength="100"
                  placeholder="your@email.com" // TODO: Localize via intl props
                  {...fields.email}
                />
                {!forgetPasswordIsShown &&
                  <input
                    className="form-control"
                    disabled={forgetPasswordIsShown}
                    maxLength="1000"
                    placeholder="password" // TODO: Localize via intl props
                    type="password"
                    {...fields.password}
                  />
                }
                {!forgetPasswordIsShown ?
                  <div className="buttons">
                    <button
                      className="btn btn-primary btn-sm"
                    ><FormattedMessage {...messages.login} /></button>{' '}
                    <button
                      className="btn btn-success btn-sm"
                      onClick={this.onSignUpClick}
                      type="button"
                    ><FormattedMessage {...messages.signUp} /></button>{' '}
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={this.toggleForgetPassword}
                      type="button"
                    ><FormattedMessage {...messages.forgotPassword} /></button>
                  </div>
                :
                  <div className="buttons">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={this.onResetPasswordClick}
                      type="button"
                    ><FormattedMessage {...messages.forgotPassword} /></button>{' '}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={this.toggleForgetPassword}
                      type="button"
                    ><FormattedMessage {...messages.dismiss} /></button>
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
                <FormattedMessage {...messages.recoveryEmailHasBeenSent} />
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
  auth: state.auth
}), { ...firebaseActions, replace })(Login);
