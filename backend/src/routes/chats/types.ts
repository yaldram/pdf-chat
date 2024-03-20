export type RelevantDocument = {
  id: string;
  text: string;
  start: string;
};

export type GetRelevantQueriesArgs = {
  userQuery: string;
  topN?: number;
};

export type RetrieveDocumentsArgs = {
  userQuery: string;
  topN?: number;
  filter?: object;
};

export type RerankDocumentsArgs = {
  documents: RelevantDocument[];
  query: string;
  topN?: number;
};

export type RerankArgs = {
  searchQueriesTopN: number;
  relevantDocumentsTopN: number;
  rerankDocumentsTopN: number;
};
