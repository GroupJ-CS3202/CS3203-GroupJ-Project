import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import {CEvent} from "./calendar";

const connectionString = process.env.REACT_APP_AZURE_STORAGE_CONNECTION_STRING!;
const containerName = "events";

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
export const containerClient = blobServiceClient.getContainerClient(containerName);

export async function uploadEvent(blobName: string, content: string) {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(content, content.length);
    console.log(`${blobName} uploaded`);
}

export async function downloadEvents(date: string): Promise<CEvent[]> {
    const containerClient = blobServiceClient.getContainerClient("events");
    const events: CEvent[] = [];
    
    for await (const blob of containerClient.listBlobsFlat()) {
        if (blob.name.startsWith(date)) {
            const client = containerClient.getBlockBlobClient(blob.name);
            const download = await client.download();
            const text = await streamToString(download.readableStreamBody);
            
            const obj = JSON.parse(text);
            events.push ({
                ...obj,
                blobName:blob.name
            });
        }
    }
    return events;
}

async function streamToString(readableStream: NodeJS.ReadableStream | undefined): Promise<string> {
    if (!readableStream) return "";
    return new Promise((resolve, reject) => {
        const chunks: string[] = [];
        readableStream.on("data", (data: any) => chunks.push(data.toString()));
        readableStream.on("end", () => resolve(chunks.join("")));
        readableStream.on("error", reject);
    });
}

export async function deleteEvent(blobName: string){
    try{
        const containerClient = blobServiceClient.getContainerClient("events");
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.deleteIfExists();
        console.log("Deleted:", blobName);
    } catch(err){
        console.error("Delete failed:",err);
    }
}