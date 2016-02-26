export default {
  app: {
    footer: {
      madeByHtml: `
        made by <a target="_blank" href="https://twitter.com/steida">steida</a>,
        report an <a target="_blank" href="https://github.com/steida/vetoapp/issues/new">issue</a>`
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
        signup: 'Odhlásit se'
      },
      legend: 'Přihlášení',
      placeholder: {
        email: 'tvuj@email.com',
        password: 'heslo'
      },
      wrongPassword: 'Špatné heslo.'
    },
    logout: {
      button: 'Odhlásit se'
    },
    login: {
      title: 'Přihlášení'
    },
    // TODO: Localize.
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
      <p>Zákonů je tak strašné množství, že už se v nich nevyznají ani
      právníci. Na poslance spoléhat nemůžeme, mají tolik práce s psaním
      zákonů nových, že na rušení starých jim už nezbývá čas.</p><p>Naštěstí si
      můžeme pomoci sami. V Ústavě ČR je kouzelná věta: <b>Lid je zdrojem veškeré
      státní moci</b>. Svobodnější země jako je třeba Švýcarsko, znají
      <a target="_blank" href="http://mmister.com/lidove-veto-co-to-je-a-proc-to-funguje">lidové veto</a>.
      My ho můžeme mít také. <b>Nečekejme na volby, měňme věci teď</b>.</p>`
  },
  me: {
    title: 'Já',
    h2: 'ahoj {displayName}',
    p: `Tohle je tvá osobní stránka, na které časem uvidíš spoustu zajímavých
      věcí.`
  },
  notFound: {
    continueMessage: 'Pokračujte prosím zde.',
    header: 'Tato stránka neexistuje.',
    message: 'Možná máte špatný odkaz, nebo byla stránka smazána.',
    title: 'Tato stránka neexistuje'
  }
};
