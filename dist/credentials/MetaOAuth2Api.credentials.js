"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaOAuth2Api = void 0;
class MetaOAuth2Api {
    constructor() {
        this.name = 'metaOAuth2Api';
        this.extends = ['oAuth2Api'];
        this.displayName = 'Meta OAuth2 API';
        this.documentationUrl = 'https://developers.facebook.com/docs/facebook-login/';
        this.properties = [
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'hidden',
                default: 'authorizationCode',
            },
            {
                displayName: 'Authorization URL',
                name: 'authUrl',
                type: 'hidden',
                default: 'https://www.facebook.com/v18.0/dialog/oauth',
            },
            {
                displayName: 'Access Token URL',
                name: 'accessTokenUrl',
                type: 'hidden',
                default: 'https://graph.facebook.com/v18.0/oauth/access_token',
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'hidden',
                default: 'pages_messaging,pages_read_engagement,instagram_basic,instagram_manage_messages,instagram_manage_comments,whatsapp_business_messaging',
            },
            {
                displayName: 'Auth URI Query Parameters',
                name: 'authQueryParameters',
                type: 'hidden',
                default: '',
            },
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'hidden',
                default: 'body',
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
exports.MetaOAuth2Api = MetaOAuth2Api;
