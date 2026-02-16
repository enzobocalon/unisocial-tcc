export type Source = {
  uri: string;
};

export type SourceWithId = Source & { id: string; extension: string };
