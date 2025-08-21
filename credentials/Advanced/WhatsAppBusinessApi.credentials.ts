import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class WhatsAppBusinessApi implements ICredentialType {
  name = 'whatsAppBusinessApi';
  displayName = 'WhatsApp Business API';
  documentationUrl = 'https://developers.facebook.com/docs/whatsapp';
  properties: INodeProperties[] = [
    {
      displayName: 'Access Token',
      name: 'accessToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'WhatsApp Business API Access Token',
    },
    {
      displayName: 'Phone Number ID',
      name: 'phoneNumberId',
      type: 'string',
      default: '',
      required: true,
      description: 'WhatsApp Business Phone Number ID',
    },
    {
      displayName: 'Business Account ID',
      name: 'businessAccountId',
      type: 'string',
      default: '',
      required: true,
      description: 'WhatsApp Business Account ID',
    },
    {
      displayName: 'Webhook Verify Token',
      name: 'webhookVerifyToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Token para verificação de webhook',
    },
  ];
}
