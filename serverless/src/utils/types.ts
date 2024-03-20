export type PaperRecord = {
    _id: string;
    title: string;
    author: string;
    fileUrl: string;
    tags: string[];
    collectionId: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateEmbeddingRecord = {
    text: string;
    embedding: number[];
    pageNumber: number;
    collectionId: string;
    paperId: string;
    paper: PaperRecord;
    createdAt: Date;
    updatedAt: Date;
};
