"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instagram = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const axios_1 = __importDefault(require("axios"));
class Instagram {
    constructor() {
        this.description = {
            displayName: 'Instagram',
            name: 'instagram',
            icon: 'file:instagram.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Interact with Instagram Business API',
            defaults: {
                name: 'Instagram',
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [
                {
                    name: 'metaOAuth2Api',
                    required: false,
                },
                {
                    name: 'metaAccessToken',
                    required: false,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Message',
                            value: 'message',
                        },
                        {
                            name: 'Comment',
                            value: 'comment',
                        },
                        {
                            name: 'Media',
                            value: 'media',
                        },
                        {
                            name: 'User',
                            value: 'user',
                        },
                    ],
                    default: 'message',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['message'],
                        },
                    },
                    options: [
                        {
                            name: 'Send',
                            value: 'send',
                            description: 'Send a message',
                            action: 'Send a message',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get messages',
                            action: 'Get messages',
                        },
                        {
                            name: 'Reply',
                            value: 'reply',
                            description: 'Reply to a message',
                            action: 'Reply to a message',
                        },
                    ],
                    default: 'send',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['comment'],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get comments',
                            action: 'Get comments',
                        },
                        {
                            name: 'Reply',
                            value: 'reply',
                            description: 'Reply to a comment',
                            action: 'Reply to a comment',
                        },
                        {
                            name: 'Hide',
                            value: 'hide',
                            description: 'Hide a comment',
                            action: 'Hide a comment',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a comment',
                            action: 'Delete a comment',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Instagram Business Account ID',
                    name: 'accountId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The Instagram Business Account ID',
                },
                {
                    displayName: 'Recipient ID',
                    name: 'recipientId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['send', 'reply'],
                            resource: ['message'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The recipient user ID',
                },
                {
                    displayName: 'Message Text',
                    name: 'messageText',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['send', 'reply'],
                            resource: ['message'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The message text to send',
                },
                {
                    displayName: 'Media ID',
                    name: 'mediaId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['comment'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The media ID to get comments from',
                },
                {
                    displayName: 'Comment ID',
                    name: 'commentId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['reply', 'hide', 'delete'],
                            resource: ['comment'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The comment ID',
                },
                {
                    displayName: 'Reply Text',
                    name: 'replyText',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['reply'],
                            resource: ['comment'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The reply text',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let credentials;
        try {
            credentials = await this.getCredentials('metaOAuth2Api');
        }
        catch {
            credentials = await this.getCredentials('metaAccessToken');
        }
        const accessToken = credentials.accessToken;
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'message') {
                    if (operation === 'send') {
                        const accountId = this.getNodeParameter('accountId', i);
                        const recipientId = this.getNodeParameter('recipientId', i);
                        const messageText = this.getNodeParameter('messageText', i);
                        const response = await axios_1.default.post(`https://graph.facebook.com/v18.0/${accountId}/messages`, {
                            recipient: { id: recipientId },
                            message: { text: messageText },
                        }, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        returnData.push({
                            json: response.data,
                            pairedItem: { item: i },
                        });
                    }
                    if (operation === 'get') {
                        const accountId = this.getNodeParameter('accountId', i);
                        const response = await axios_1.default.get(`https://graph.facebook.com/v18.0/${accountId}/conversations`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });
                        returnData.push({
                            json: response.data,
                            pairedItem: { item: i },
                        });
                    }
                }
                if (resource === 'comment') {
                    if (operation === 'get') {
                        const mediaId = this.getNodeParameter('mediaId', i);
                        const response = await axios_1.default.get(`https://graph.facebook.com/v18.0/${mediaId}/comments`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                            params: {
                                fields: 'id,text,username,timestamp,replies',
                            },
                        });
                        returnData.push({
                            json: response.data,
                            pairedItem: { item: i },
                        });
                    }
                    if (operation === 'reply') {
                        const commentId = this.getNodeParameter('commentId', i);
                        const replyText = this.getNodeParameter('replyText', i);
                        const response = await axios_1.default.post(`https://graph.facebook.com/v18.0/${commentId}/replies`, {
                            message: replyText,
                        }, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        returnData.push({
                            json: response.data,
                            pairedItem: { item: i },
                        });
                    }
                    if (operation === 'hide') {
                        const commentId = this.getNodeParameter('commentId', i);
                        const response = await axios_1.default.post(`https://graph.facebook.com/v18.0/${commentId}`, {
                            hide: true,
                        }, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        returnData.push({
                            json: response.data,
                            pairedItem: { item: i },
                        });
                    }
                    if (operation === 'delete') {
                        const commentId = this.getNodeParameter('commentId', i);
                        const response = await axios_1.default.delete(`https://graph.facebook.com/v18.0/${commentId}`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });
                        returnData.push({
                            json: { success: true, commentId },
                            pairedItem: { item: i },
                        });
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: error.message },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                    itemIndex: i,
                });
            }
        }
        return [returnData];
    }
}
exports.Instagram = Instagram;
