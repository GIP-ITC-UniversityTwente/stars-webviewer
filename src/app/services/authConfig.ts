interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: '2yX67jth2pOwXEBN3vZWRPvlduh61qzh',   // see dashboard > clients >  app > settings
  domain: 'stars-itc.eu.auth0.com',               // see dashboard > clients >  app > settings
  //callbackURL: 'https://stars.itc.nl'             // prod
  callbackURL: 'http://localhost:4200/callback' // development
};
