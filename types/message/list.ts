type RenderRoomList = Array<{
  id: number;
  global_id: string;
  name: string;
  cover: string;
  type: 'dialog' | 'group';
}>;

type RenderPromptList = Array<{
  id: number;
  global_id: string;
  name: string;
}>;
