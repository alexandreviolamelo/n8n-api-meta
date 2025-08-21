"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramTrigger = void 0;
class InstagramTrigger {
    constructor() {
        this.description = {
            displayName: 'Instagram Business Trigger',
            name: 'instagramTrigger',
            icon: 'file:instagram.svg',
            group: ['trigger'],
            version: 1,
            description: 'Trigger for Instagram Business API webhooks (messages, comments, mentions)',
            defaults: {
                name: 'Instagram Business Trigger',
            },
            inputs: [],
            outputs: ["main" /* NodeConnectionType.Main */],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'GET',
                    responseMode: 'onReceived',
                    path: 'instagram',
                },
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'instagram',
                },
            ],
            properties: [
                {
                    displayName: 'Webhook Verify Token',
                    name: 'verifyToken',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The verify token for Instagram webhook verification',
                },
                {
                    displayName: 'Events',
                    name: 'events',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Messages',
                            value: 'messages',
                            description: 'Direct messages received',
                        },
                        {
                            name: 'Comments',
                            value: 'comments',
                            description: 'Comments on posts',
                        },
                        {
                            name: 'Mentions',
                            value: 'mentions',
                            description: 'Mentions in stories',
                        },
                        {
                            name: 'Story Insights',
                            value: 'story_insights',
                            description: 'Story insights data',
                        },
                    ],
                    default: ['messages', 'comments'],
                    description: 'The Instagram events to listen for',
                },
            ],
        };
    }
    async webhook() {
        const req = this.getRequestObject();
        const query = this.getQueryData();
        const body = this.getBodyData();
        const headers = this.getHeaderData();
        const method = req.method;
        // Log detalhado para debug
        console.log('=== INSTAGRAM WEBHOOK DEBUG ===');
        console.log('Method:', method);
        console.log('Query:', JSON.stringify(query, null, 2));
        console.log('Body:', JSON.stringify(body, null, 2));
        console.log('Headers:', JSON.stringify(headers, null, 2));
        // GET request - Verificação do webhook pela Meta
        if (method === 'GET') {
            const mode = query['hub.mode'];
            const token = query['hub.verify_token'];
            const challenge = query['hub.challenge'];
            console.log('=== WEBHOOK VERIFICATION ===');
            console.log('Mode:', mode);
            console.log('Token received:', token);
            console.log('Challenge:', challenge);
            const configuredToken = this.getNodeParameter('verifyToken');
            console.log('Token configured:', configuredToken);
            // Verificar se é uma requisição de verificação válida
            if (mode === 'subscribe' && token === configuredToken && challenge) {
                console.log('✅ Verification successful, returning challenge:', challenge);
                // Retornar o challenge diretamente como string
                return {
                    webhookResponse: challenge,
                };
            }
            else {
                console.log('❌ Verification failed');
                console.log('Mode check:', mode === 'subscribe');
                console.log('Token check:', token === configuredToken);
                console.log('Challenge check:', !!challenge);
                // Retornar erro de verificação
                const res = this.getResponseObject();
                res.status(403).send('Verification failed');
                return {
                    noWebhookResponse: true,
                };
            }
        }
        // POST request - Eventos do Instagram
        if (method === 'POST') {
            console.log('=== INSTAGRAM EVENT RECEIVED ===');
            // Verificar se é um evento do Instagram válido
            if (!body || typeof body !== 'object') {
                console.log('❌ Invalid body received');
                const res = this.getResponseObject();
                res.status(400).send('Invalid body');
                return {
                    noWebhookResponse: true,
                };
            }
            const instagramData = body;
            // Verificar se é um evento do Instagram
            if (instagramData.object !== 'instagram') {
                console.log('❌ Not an Instagram event, object:', instagramData.object);
                const res = this.getResponseObject();
                res.status(400).send('Not an Instagram event');
                return {
                    noWebhookResponse: true,
                };
            }
            console.log('✅ Valid Instagram event received');
            // Processar cada entrada do evento
            const executionData = [];
            if (instagramData.entry && Array.isArray(instagramData.entry)) {
                for (const entry of instagramData.entry) {
                    console.log('Processing entry:', JSON.stringify(entry, null, 2));
                    // Processar mensagens
                    if (entry.messaging && Array.isArray(entry.messaging)) {
                        for (const message of entry.messaging) {
                            executionData.push({
                                json: {
                                    eventType: 'message',
                                    instagramId: entry.id,
                                    timestamp: entry.time,
                                    sender: message.sender,
                                    recipient: message.recipient,
                                    message: message.message,
                                    originalEvent: instagramData,
                                    receivedAt: new Date().toISOString(),
                                },
                            });
                        }
                    }
                    // Processar mudanças (comentários, menções, etc.)
                    if (entry.changes && Array.isArray(entry.changes)) {
                        for (const change of entry.changes) {
                            let eventType = 'unknown';
                            if (change.field === 'comments') {
                                eventType = 'comment';
                            }
                            else if (change.field === 'mentions') {
                                eventType = 'mention';
                            }
                            else if (change.field === 'story_insights') {
                                eventType = 'story_insight';
                            }
                            executionData.push({
                                json: {
                                    eventType,
                                    instagramId: entry.id,
                                    timestamp: entry.time,
                                    field: change.field,
                                    value: change.value,
                                    originalEvent: instagramData,
                                    receivedAt: new Date().toISOString(),
                                },
                            });
                        }
                    }
                }
            }
            console.log('✅ Processed', executionData.length, 'events');
            // Se não há dados para processar, ainda assim confirma o recebimento
            if (executionData.length === 0) {
                console.log('⚠️ No processable data found, but confirming receipt');
                executionData.push({
                    json: {
                        eventType: 'unknown',
                        message: 'Event received but no processable data found',
                        originalEvent: instagramData,
                        receivedAt: new Date().toISOString(),
                    },
                });
            }
            // Retornar dados para o workflow usando o método correto
            return {
                workflowData: [executionData],
            };
        }
        // Método não suportado
        console.log('❌ Unsupported method:', method);
        const res = this.getResponseObject();
        res.status(405).send('Method not allowed');
        return {
            noWebhookResponse: true,
        };
    }
}
exports.InstagramTrigger = InstagramTrigger;
