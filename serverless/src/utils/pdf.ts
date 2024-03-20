import https from 'node:https';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getDocument } from 'pdfjs-dist';

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

// Function to download the PDF file and return it as a Uint8Array
export async function downloadPdf(url: string) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            const chunks: Uint8Array[] = [];

            response.on('data', (chunk) => chunks.push(chunk));

            response.on('end', () => {
                const pdfData = Buffer.concat(chunks);
                resolve(new Uint8Array(pdfData));
            });

            response.on('error', (error) => {
                reject(error);
            });
        });
    });
}

// Function to extract text from the PDF using pdfjs-dist
export async function getDocumentsFromPdf(pdfData: Uint8Array) {
    // Loading the PDF file
    const pdfDocument = await getDocument({ data: pdfData }).promise;

    const documents = [];
    const totalPages = pdfDocument.numPages;

    for (let i = 1; i <= totalPages; i++) {
        // Get each page
        const page = await pdfDocument.getPage(i);

        // Extract the text content from the page
        const textData = await page.getTextContent();

        // Combine all the items' strings into one string
        const text = textData.items.map((item: any) => item.str).join(' ');

        const document = new Document({
            pageContent: text,
            metadata: {
                page: i,
            },
        });

        documents.push(document);
    }

    return splitter.splitDocuments(documents);
}

export async function extractTextFromPdf(pdfData: Uint8Array, maxCharacters: number, pagesToRead?: number) {
    // Loading the PDF file
    const pdfDocument = await getDocument({ data: pdfData }).promise;

    let textContent = '';
    const totalPages = pdfDocument.numPages;
    const pagesLimit = pagesToRead ? Math.min(pagesToRead, totalPages) : totalPages;

    for (let i = 1; i <= pagesLimit; i++) {
        // Get each page
        const page = await pdfDocument.getPage(i);

        // Extract the text content from the page
        const textData = await page.getTextContent();

        // Combine all the items' strings into one string
        const text = textData.items.map((item) => item.str).join(' ');

        textContent += text;
    }

    textContent = textContent.substring(0, maxCharacters);

    return textContent;
}
