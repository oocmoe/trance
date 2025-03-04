export type RenderRegexList = Array<{
  id: number;
  global_id: string;
  name: string;
  is_Enabled: boolean;
}>;

export type PromptContentListState = Array<{
  id: number;
  identifier: string;
  name: string;
}>;

export type RenderRoomList = Array<{
  id: number;
  global_id: string;
  name: string;
  cover: string;
  type: 'dialog' | 'group';
}>;

export type RenderPromptList = Array<{
  id: number;
  global_id: string;
  name: string;
}>;

export type RenderCharacterList = Array<{
  id: number;
  global_id: string;
  cover: string;
  name: string;
  creator: string | null;
  version: string | null;
}>;

export type RenderMessages = Array<{
  id: number;
  global_id: string;
  type: 'text';
  is_Sender: number;
  content: string;
  role: 'system' | 'user' | 'assistant';
}>;
