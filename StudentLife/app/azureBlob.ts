import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.REACT_APP_AZURE_STORAGE_CONNECTION_STRING!;
const containerName = "events";

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
export const containerClient = blobServiceClient.getContainerClient(containerName);

// Blob 업로드
export async function uploadEvent(blobName: string, content: string) {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(content, content.length);
    console.log(`${blobName} 업로드 완료`);
}

// Blob 다운로드
export async function downloadEvents(date: string) {
    const blobs = containerClient.listBlobsFlat();
    const events: any[] = [];
    for await (const blob of blobs) {
        if (blob.name.startsWith(date)) {
            const client = containerClient.getBlockBlobClient(blob.name);
            const resp = await client.download();
            const text = await streamToString(resp.readableStreamBody);
            if (typeof text === "string"){
                events.push(JSON.parse((text as string)));
            }
        }
    }
    return events;
}

// 스트림 → 문자열 변환
async function streamToString(readableStream: any) {
    return new Promise((resolve, reject) => {
        const chunks: string[] = [];
        readableStream.on("data", (data: any) => chunks.push(data.toString()));
        readableStream.on("end", () => resolve(chunks.join("")));
        readableStream.on("error", reject);
    });
}