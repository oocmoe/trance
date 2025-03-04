import { PromptContent } from '@/db/schema/prompt';

export type ConvertCharacterResult = {
  character: {
    global_id: string;
    cover: string;
    name: string;
    description: string;
    prologue: { name: string; content: string }[];
    creator: string;
    handbook: string;
    version: string;
    personality: string;
    scenario: string;
    mes_example: string;
    system_prompt: string;
    post_history_instructions: string;
  };
};

export type ConverPromptResult = {
  name: string;
  content: PromptContent;
};

export type ConvertRgexResult = {
  name: string;
  replace: string;
  placement: string;
  is_Enabled: boolean;
  is_Global: boolean;
  is_Send: boolean;
  is_Render: boolean;
};
