export default {
  app: {
    footer: {
      madeByHtml: `
        made by <a target="_blank" href="https://twitter.com/steida">steida</a>,
        report an <a target="_blank" href="https://github.com/steida/vetoapp/issues/new">issue</a>`
    },
    // Links should be pages titles as well.
    links: {
      about: 'O nás',
      home: 'Přehled',
      login: 'Přihlášení',
      me: 'Já',
      suggestVeto: 'Navrhnout veto',
      vetos: 'Veta'
    }
  },
  auth: {
    facebookLogin: 'Přihlásit se přes Facebook',
    emailLoginSignup: 'Email Přihlášení / Vytvoření účtu',
    login: 'Přihlásit se',
    loginTitle: 'Přihlášení',
    signUp: 'Vytvořit účet',
    logout: 'Odhlásit se',
    forgotPassword: 'Reset hesla',
    recoveryEmailHasBeenSent: 'Na váš email jsme zaslali návod k resetu hesla.',
    resetPassword: 'Resetovat heslo',
    dismiss: 'Zpět',
    validation: {
      email: 'Emailová adresa není ve správném formátu.',
      password: 'Heslo musí obsahovat minimálně {minLength} znaků.',
      required: `Prosím vyplňte {prop, select,
        email {email}
        password {heslo}
        other {'{prop}'}
      }.`
    }
  },
  home: {
    title: 'Vetoapp',
    infoText: `
      <p>Zákonů je tak strašný množství, že se v nich nevyznají už ani
      právníci. Na poslance spoléhat nemůžeme, mají tolik práce s psaním
      zákonů nových, že na rušení starých jim už nezbývá čas.</p><p>Naštěstí si
      můžeme pomoci sami. V Ústavě ČR je kouzelná věta: <b>Lid je zdrojem veškeré
      státní moci</b>. Svobodnější země jako je třeba Švýcarsko, znají
      <a target="_blank" href="http://mmister.com/lidove-veto-co-to-je-a-proc-to-funguje">lidové veto</a>.
      My ho můžeme mít také. <b>Nečekejme na volby, měňme věci teď</b>.</p>`,
    callToAction: 'Jo, to dává smysl. Chci se přidat.'
  },
  me: {
    title: 'Já',
    h2: '{displayName}'
  },
  notFound: {
    continueMessage: 'Pokračujte prosím zde.',
    header: 'Tato stránka neexistuje.',
    message: 'Možná máte špatný odkaz, nebo byla stránka smazána.',
    title: 'Tato stránka neexistuje'
  },
  vetos: {
    suggestVeto: {

    }
  }
};
