interface AuthConfiguration {
    clientID: string;
    domain: string;
    callbackURL: string;
    memberRouter: string[];
    responseType: string;
}

export const myAuthConfig: AuthConfiguration = {
    clientID: 'UhMrdGno87iwJacMYSZYOq53ImO7IHa6',
    domain: 'nurruty.auth0.com',
    callbackURL: 'http://localhost:4200/',
    memberRouter: ['/home'],
    responseType: 'token'
};
