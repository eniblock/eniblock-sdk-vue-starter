import { OAuth2AuthCodePkceClient } from "oauth2-pkce";

class AuthService {
    oauthClient;

    constructor() {
        this.oauthClient = new OAuth2AuthCodePkceClient({
            scopes: ["openid", "email", "profile", "eniblock", "offline_access"],
            authorizationUrl: `https://auth.sdk.eniblock.com/oauth2/auth`,
            tokenUrl: `https://auth.sdk.eniblock.com/oauth2/token`,
            clientId: "a41b90ce-a548-49a3-a403-7ead41a31140",
            redirectUrl: window.origin + "/check",
            storeRefreshToken: true, // Be careful with this option
            extraAuthorizationParams: { audience: "https://sdk.eniblock.com" },
            /* onAccessTokenExpiry() {
               // when the access token has expired
               return oauthClient.exchangeRefreshTokenForAccessToken();
             },*/
            onInvalidGrant() {
                // when there is an error getting a token with a grant
                console.warn("Invalid grant! Auth code or refresh token need to be renewed.");
                // you probably want to redirect the user to the login page here
            },
            onInvalidToken() {
                // the token is invalid, e. g. because it has been removed in the backend
                console.warn("Invalid token! Refresh and access tokens need to be renewed.");
                // you probably want to redirect the user to the login page here
            },
        });
    }

    isLoggedIn() {
        return this.oauthClient.isAuthorized();
    }

    login() {
        return this.oauthClient.requestAuthorizationCode();
    }

    logout() {
        return this.oauthClient.reset();
    }

    receiveCode() {
        return this.oauthClient.receiveCode();
    }

    getTokens() {
        return this.oauthClient.getTokens({ "": "" });
    }
}

export default new AuthService();
