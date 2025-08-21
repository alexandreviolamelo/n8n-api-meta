"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramApi = void 0;
class InstagramApi {
    constructor() {
        this.name = 'instagramApi';
        this.displayName = 'Instagram Business API';
        this.documentationUrl = 'https://developers.facebook.com/docs/instagram-api';
        this.properties = [
            {
                displayName: 'Page Access Token',
                name: 'accessToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Facebook/Instagram Page Access Token with required permissions',
                required: true,
            },
            {
                displayName: 'Webhook Verify Token',
                name: 'webhookVerifyToken',
                type: 'string',
                default: '',
                description: 'Custom token used to verify webhook subscriptions (you define this)',
                required: true,
            },
            {
                displayName: 'App Secret',
                name: 'appSecret',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Facebook App Secret (optional, for webhook signature validation)',
            },
            {
                displayName: 'Page ID',
                name: 'pageId',
                type: 'string',
                default: '',
                description: 'Facebook/Instagram Business Page ID',
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
                method: 'GET',
            },
        };
    }
}
exports.InstagramApi = InstagramApi;
