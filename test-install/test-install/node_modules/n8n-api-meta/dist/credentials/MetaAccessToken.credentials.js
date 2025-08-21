"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaAccessToken = void 0;
class MetaAccessToken {
    constructor() {
        this.name = 'metaAccessToken';
        this.displayName = 'Meta Access Token';
        this.documentationUrl = 'https://developers.facebook.com/docs/facebook-login/access-tokens/';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'The Meta (Facebook/Instagram/WhatsApp) access token',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.accessToken}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://graph.facebook.com/v18.0',
                url: '/me',
            },
        };
    }
}
exports.MetaAccessToken = MetaAccessToken;
