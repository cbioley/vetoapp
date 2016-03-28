export const LOGOUT = 'LOGOUT';

export function logout() {
  return ({ engine, firebase }) => {
    engine.save({});
    firebase.unauth();
    return {
      type: LOGOUT
    };
  };
}
