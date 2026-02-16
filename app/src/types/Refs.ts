export interface ReplyRef {
  focus(): void;
  present(): void;
}

export interface PostActionsRef {
  openReply(): void;
  openLikes(): void;
  openSharesList(): void;
}
