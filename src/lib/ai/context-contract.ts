export type AIHistoryItem = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
};

export type AIKnowledgeItem = {
  id?: string;
  title: string;
  content: string;
  score?: number;
};

export type AIAttachmentItem = {
  name: string;
  content?: string;
};

export interface AIExecutionContext {
  source:
    | 'ticket-triage'
    | 'ticket-collection'
    | 'ticket-solver'
    | 'ticket-curation'
    | 'ticket-sentiment'
    | 'ticket-runtime'
    | 'widget'
    | 'magic-compose';
  ticket: {
    id?: number | string;
    title: string;
    description: string;
    status?: string;
    priority?: string;
    category?: string;
    type?: string;
    impact?: string;
    urgency?: string;
  };
  requester?: {
    id?: string;
    name?: string | null;
    department?: string | null;
  };
  history?: AIHistoryItem[];
  attachments?: AIAttachmentItem[];
  knowledgeBase?: AIKnowledgeItem[];
  feedback?: string;
  instructions?: string[];
}

export function buildAIExecutionContext(context: AIExecutionContext) {
  return JSON.stringify(context, null, 2);
}
