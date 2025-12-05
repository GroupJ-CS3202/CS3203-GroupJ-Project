/*
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

export async function editEvent(blobName: string, newContent: any){
    await uploadEvent(blobName, JSON.stringify(newContent));
}

async function streamToString(readableStream: NodeJS.ReadableStream | undefined): Promise<string> {
    if (!readableStream) return "";
    return new Promise((resolve, reject) => {
        const chunks: string[] = [];
        readableStream.on("data", (data: any) => chunks.push(data.toString()));
        readableStream.on("end", () => resolve(chunks.join("")));
        readableStream.on("error", reject);
    });
}*/
/*
import { BlobServiceClient } from "@azure/storage-blob";
import Constants from "expo-constants";

export const AZURE_STORAGE_CONNECTION_STRING =
  Constants.manifest?.extra?.AZURE_STORAGE_CONNECTION_STRING ?? "";

const connectionString = AZURE_STORAGE_CONNECTION_STRING;
const containerName = "events";

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

export async function addBlob(blobName: string, content: string) {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(content, Buffer.byteLength(content), {
      blobHTTPHeaders: { blobContentType: "application/json" }
    });

    return { success: true, url: blockBlobClient.url };
  } catch (err: any) {
    console.error("addBlob error:", err.message);
    throw err;
  }
}
export async function deleteBlob(blobName: string) {
  const blobClient = containerClient.getBlockBlobClient(blobName);
  await blobClient.deleteIfExists();
  return { success: true, deleted: blobName };
}
export async function getBlob(blobName: string) {
  const blobClient = containerClient.getBlockBlobClient(blobName);

  const download = await blobClient.download();
  const chunks: Buffer[] = [];

  for await (const chunk of download.readableStreamBody!) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const text = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(text);
}
export async function listEventsByDate(date: string) {
  const events: any[] = [];

  for await (const blob of containerClient.listBlobsFlat()) {
    if (blob.name.startsWith(date)) {
      const event = await getBlob(blob.name);
      events.push({ ...event, blobName: blob.name });
    }
  }
  return events;
}*/

export interface CEvent {
  name: string;
  desc: string;
  blobName: string;
}
//for backend server
const BASE_URL = 'http://localhost:3001/api'; 

export async function addBlob(event: CEvent): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/event/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('addBlob failed. server response:', response.status, errorText);
      throw new Error(`Failed to save event. Status: ${response.status}`);
    }
    console.log('Event successfully saved as blob:', event.blobName);
  } catch (error) {
    console.error('addBlob error occurred:', error);
    throw error;
  }
}


export async function editEvent(blobName: string, updatedEvent: CEvent): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/event/edit/${blobName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('editEvent failed. server response:', response.status, errorText);
      throw new Error(`Failed to update event. Status: ${response.status}`);
    }
    console.log('Event successfully updated:', blobName);
  } catch (error) {
    console.error('editEvent error occurs:', error);
    throw error;
  }
}

export async function deleteBlob(blobName: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/event/delete/${blobName}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('deleteBlob failed. server response:', response.status, errorText);
      throw new Error(`Failed to delete blob. Status: ${response.status}`);
    }
    console.log('Blob successfully deleted:', blobName);
  } catch (error) {
    console.error('deleteBlob error occurs:', error);
    throw error;
  }
}


export async function listEventsByDate(dateString: string): Promise<CEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/events/${dateString}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('listEventsByDate failed. server response:', response.status, errorText);
      return []; 
    }
    
    const events: CEvent[] = await response.json();
    console.log(`Events loaded for ${dateString}:`, events.length);
    return events;

  } catch (error) {
    console.error('listEventsByDate error occur. empty list return:', error);
    return []; 
  }
}