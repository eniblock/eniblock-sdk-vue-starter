import {generateChallenge, generateVerifier} from "@/utils/pkce";
import axios from "axios";
import {Eniblock, UnsafeStorage} from "@eniblock/sdk";

const redirectUri = 'https://a.myho.st:8888/check';
const clientId = 'a41b90ce-a548-49a3-a403-7ead41a31140';
const oauth2SdkUrl = 'https://auth.sdk.eniblock.com';

/**
 * Here is an implementation of the Authorization code flow as shown here https://www.ory.sh/docs/oauth2-oidc/authorization-code-flow.
 * Many libraries exist (https://www.npmjs.com/package/oidc-client-ts, https://www.npmjs.com/package/@auth0/auth0-spa-js ...), , you can check on https://www.npmjs.com/
 */
class AuthService {

    // Method to initiate login process
    login() {
        const verifier = generateVerifier();
        const challenge = generateChallenge(verifier);
        const state = generateVerifier();

        // Save the verifier, challenge and state in local storage for later use
        localStorage.setItem('starter_sdk_vue_pkce_verifier', verifier);
        localStorage.setItem('starter_sdk_vue_pkce_state', state);
        localStorage.setItem('starter_sdk_vue_pkce_challenge', challenge);

        const authorizationUrl = `${oauth2SdkUrl}/oauth2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${
            encodeURIComponent(redirectUri)
        }&response_type=code&scope=${
            encodeURIComponent('openid profile email eniblock offline_access')
        }&code_challenge=${
            encodeURIComponent(challenge)
        }&code_challenge_method=S256&audience=${
            encodeURIComponent('https://sdk.eniblock.com')
        }&state=${
            encodeURIComponent(state)
        }`;
        window.location.replace(authorizationUrl);
    }

    // Method to handle logout
    async logout(accessToken: string) {
        // Get an instance of Eniblock SDK, delete the TSS Wallet share and clear local storage
        const sdk = new Eniblock({
            appId: 'eniblock-demo',
            accessTokenProvider: () => Promise.resolve(accessToken),
            storageItems: [{alias: "UnsafeStorage", storage: new UnsafeStorage()}],
        });
        await sdk.wallet.destroy();
        console.warn('Your local Eniblock SDK Wallet is destroyed.');
        localStorage.clear();
    }

    // Method to handle receiving the authorization code from the callback URL
    async receiveCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const savedState = localStorage.getItem('starter_sdk_vue_pkce_state');
        const verifier = localStorage.getItem('starter_sdk_vue_pkce_verifier');
        const challenge = localStorage.getItem('starter_sdk_vue_pkce_challenge');
        localStorage.setItem('starter_sdk_vue_pkce_code', code??'');

        if (code && verifier && challenge && state === savedState) {
            await this.getToken();
        } else {
            throw new Error('Invalid state or missing authorization code');
        }
    }

    // Method to exchange authorization code for access token
    async getToken() {
        try {
            const tokenResponse = await axios.post(`${oauth2SdkUrl}/oauth2/token`, {
                client_id: clientId,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
                code_verifier: localStorage.getItem('starter_sdk_vue_pkce_verifier'),
                code: localStorage.getItem('starter_sdk_vue_pkce_code'),
            }, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

            console.log(tokenResponse);

            const accessToken = tokenResponse.data.access_token;
            const idToken = tokenResponse.data.id_token;
            localStorage.setItem('starter_sdk_vue_access_token', accessToken);
            localStorage.setItem('starter_sdk_vue_id_token', idToken);

            // Clear the verifier and state from session storage
            localStorage.removeItem('starter_sdk_vue_pkce_verifier');
            localStorage.removeItem('starter_sdk_vue_pkce_state');

            // Get user info
            this.getUserInfo(accessToken);
            return accessToken;
        } catch (error) {
            console.error('Error fetching access token:', error);
        }
    }

    // Method to fetch user information using the access token
    getUserInfo(accessToken: string) {
        axios.get(`${oauth2SdkUrl}/userinfo`, {
            headers: {'Authorization': `Bearer ${accessToken}`}
        }).then(response => console.log('User info: ', response.data))
            .catch(error => console.error('Error fetching user information:', error));
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('starter_sdk_vue_access_token');
    }
}

export default new AuthService();
