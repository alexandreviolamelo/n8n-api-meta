"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaApi = void 0;
class MetaApi {
    constructor() {
        this.name = 'metaApi';
        this.displayName = 'Meta API';
        this.documentationUrl = 'https://developers.facebook.com/docs/graph-api/';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'The access token for Meta API. Get it from Facebook Developers Console.',
                placeholder: 'EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            },
            {
                displayName: 'App Secret',
                name: 'appSecret',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'The App Secret from your Facebook App (Required for API security)',
                placeholder: 'Enter your App Secret from Facebook Developers',
            },
            {
                displayName: 'App ID',
                name: 'appId',
                type: 'string',
                default: '',
                required: true,
                description: 'The App ID from your Facebook App',
                placeholder: 'Enter your App ID',
            },
            {
                displayName: 'API Version',
                name: 'apiVersion',
                type: 'options',
                options: [
                    { name: 'v23.0 (Latest)', value: 'v23.0' },
                    { name: 'v22.0', value: 'v22.0' },
                    { name: 'v21.0', value: 'v21.0' },
                ],
                default: 'v23.0',
                description: 'Meta Graph API version to use',
            },
        ];
    }
}
exports.MetaApi = MetaApi;
