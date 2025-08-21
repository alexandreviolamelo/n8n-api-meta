import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class InstagramAdvanced implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
    private executeDirectMessages;
    private executeStories;
    private executeLeads;
    private executeAnalytics;
    private executeAutomation;
}
//# sourceMappingURL=InstagramAdvanced.node.d.ts.map