import { OutputFormat } from "elevenlabs/api";

interface Config {
  elevenLabsApiKey: string;
  location: string;
  collectionPath: string;
  outputFormat: OutputFormat;
  modelId: string;
  bucketName: string;
  storagePath: string;
  enablePerDocumentOverrides: boolean;
  voice: string;
}

const config: Config = {
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
  location: process.env.LOCATION,
  collectionPath: process.env.COLLECTION_PATH,
  outputFormat: process.env.OUTPUT_FORMAT as unknown as OutputFormat,
  modelId: process.env.MODEL_ID,
  bucketName: process.env.BUCKET_NAME,
  storagePath: process.env.STORAGE_PATH,
  enablePerDocumentOverrides: process.env.ENABLE_PER_DOCUMENT_OVERRIDES === "yes",
  voice: process.env.VOICE,
};

export default config;
