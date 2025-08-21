"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramTrigger = void 0;
class InstagramTrigger {
    constructor() {
        this.description = {
            displayName: 'Instagram Trigger',
            name: 'instagramTrigger',
            icon: 'file:instagram.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle Instagram webhook events',
            defaults: {
                name: 'Instagram Trigger',
            },
            inputs: [],
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
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
                {
                    name: 'setup',
                    httpMethod: 'GET',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Messages',
                            value: 'messages',
                            description: 'Trigger on new messages',
                        },
                        {
                            name: 'Comments',
                            value: 'comments',
                            description: 'Trigger on new comments',
                        },
                        {
                            name: 'Mentions',
                            value: 'mentions',
                            description: 'Trigger on mentions',
                        },
                    ],
                    default: ['messages'],
                    required: true,
                },
                {
                    displayName: 'Verify Token',
                    name: 'verifyToken',
                    type: 'string',
                    default: 'secreto_123',
                    required: true,
                    description: 'Token used to verify the webhook',
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    return true;
                },
                async create() {
                    return true;
                },
                async delete() {
                    return true;
                },
            },
        };
    }
    async webhook() {
        const req = this.getRequestObject();
        const res = this.getResponseObject();
        const query = this.getQueryData();
        const body = this.getBodyData();
        // Handle verification (GET request)
        if (req.method === 'GET') {
            const verifyToken = this.getNodeParameter('verifyToken');
            const mode = query['hub.mode'];
            const token = query['hub.verify_token'];
            const challenge = query['hub.challenge'];
            if (mode === 'subscribe' && token === verifyToken) {
                res.status(200).send(challenge);
                return {
                    noWebhookResponse: true,
                };
            }
            else {
                res.status(403).send('Forbidden');
                return {
                    noWebhookResponse: true,
                };
            }
        }
        // Handle webhook events (POST request)
        if (req.method === 'POST') {
            const events = this.getNodeParameter('events');
            if (body.object === 'instagram') {
                const entries = body.entry || [];
                const results = [];
                for (const entry of entries) {
                    // Handle messages
                    if (events.includes('messages') && entry.messaging) {
                        for (const message of entry.messaging) {
                            results.push({
                                json: {
                                    type: 'message',
                                    data: message,
                                    timestamp: new Date().toISOString(),
                                },
                            });
                        }
                    }
                    // Handle comments
                    if (events.includes('comments') && entry.changes) {
                        for (const change of entry.changes) {
                            if (change.field === 'comments') {
                                results.push({
                                    json: {
                                        type: 'comment',
                                        data: change.value,
                                        timestamp: new Date().toISOString(),
                                    },
                                });
                            }
                        }
                    }
                    // Handle mentions
                    if (events.includes('mentions') && entry.changes) {
                        for (const change of entry.changes) {
                            if (change.field === 'mentions') {
                                results.push({
                                    json: {
                                        type: 'mention',
                                        data: change.value,
                                        timestamp: new Date().toISOString(),
                                    },
                                });
                            }
                        }
                    }
                }
                res.status(200).send('EVENT_RECEIVED');
                if (results.length > 0) {
                    return {
                        workflowData: [results],
                    };
                }
            }
        }
        res.status(200).send('OK');
        return {
            noWebhookResponse: true,
        };
    }
}
exports.InstagramTrigger = InstagramTrigger;
