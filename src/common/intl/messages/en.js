export default {
  app: {
    footer: {
      madeByHtml: `made by <a href="https://twitter.com/steida">steida</a> with
        <a href="https://github.com/este/este">este</a>`
    },
    links: {
      home: 'Home',
      login: 'Login',
      me: 'Me'
    }
  },
  auth: {
    form: {
      button: {
        login: 'Login',
        signup: 'Sign up'
      },
      legend: 'Login',
      placeholder: {
        email: 'your@email.com',
        password: 'password'
      },
      wrongPassword: 'Wrong password.'
    },
    logout: {
      button: 'Logout'
    },
    login: {
      title: 'Login'
    },
    validation: {
      email: 'Email address is not valid.',
      password: 'Password must contain at least {minLength} characters.',
      required: `Please fill out {prop, select,
        email {email}
        password {password}
        other {'{prop}'}
      }.`
    }
  },
  home: {
    title: 'Vetoapp'
  },
  me: {
    title: 'Me',
    welcome: 'Hi {email}.'
  },
  notFound: {
    continueMessage: 'Continue here please.',
    header: 'This page isn\'t available',
    message: 'The link may be broken, or the page may have been removed.',
    title: 'Page Not Found'
  }
};
