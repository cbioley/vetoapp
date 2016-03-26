export default function getDefaultCountryByLocale(locale) {
  // TODO: This is temporally workaround. Should be automatic somehow.
  return {
    cs: 'CZ',
    en: 'US'
  }[locale] || 'US';
}
