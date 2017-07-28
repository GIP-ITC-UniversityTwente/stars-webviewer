interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: '4Q4AvhUTyB0rePqjOKhRaMb5yIYHxXSQ', // see dashboard > clients >  app > settings
  domain: 'ccabanerospatialdev.auth0.com',      // see dashboard > clients >  app > settings
  callbackURL: 'http://localhost:4200/callback'
};
