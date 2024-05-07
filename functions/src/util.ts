import { OutputFormat } from "elevenlabs/api";
import config from "./config";
import { GenerateAudioRequest } from "./types";

export interface BuildRequestOptions {
  text: string;
  outputFormat?: OutputFormat;
  modelId?: string;
  voice?: string;
}

export function buildRequest({
  text,
  outputFormat = config.outputFormat,
  modelId = config.modelId,
  voice = config.voice,
}: BuildRequestOptions): GenerateAudioRequest {
  return {
    text,
    output_format: outputFormat || "mp3_44100_128",
    model_id: modelId || "eleven_multilingual_v2",
    voice: voice || "Rachel",
  };
}

export function getFileExtension(outputFormat: string): string {
  switch (outputFormat) {
    case "mp3_22050_32":
    case "mp3_44100_32":
    case "mp3_44100_64":
    case "mp3_44100_96":
    case "mp3_44100_128":
    case "mp3_44100_192":
      return ".mp3";
    case "pcm_16000":
    case "pcm_22050":
    case "pcm_24000":
    case "pcm_44100":
      return ".pcm";
    case "ulaw_8000":
      return ".ulaw";
    default:
      return ".mp3";
  }
}
