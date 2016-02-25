export default {
  app: {
    footer: {
      madeByHtml: `napsal <a href="https://twitter.com/steida">steida</a> s
        pomocí <a href="https://github.com/este/este">este</a>`
    },
    links: {
      home: 'Domů',
      login: 'Přihlášení',
      me: 'Já'
    }
  },
  auth: {
    form: {
      button: {
        login: 'Přihlásit se',
        signup: 'Odhlásit'
      },
      legend: 'Přihlášení',
      placeholder: {
        email: 'tvuj@email.com',
        password: 'heslo'
      },
      wrongPassword: 'Špatné heslo.'
    },
    logout: {
      button: 'Odhlásit'
    },
    login: {
      title: 'Přihlášení'
    },
    // TODO: Localize.
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
    title: 'Já',
    welcome: 'Ahoj {email}.'
  },
  // TODO: Localize.
  notFound: {
    continueMessage: 'Continue here please.',
    header: 'This page isn\'t available',
    message: 'The link may be broken, or the page may have been removed.',
    title: 'Page Not Found'
  }
};
