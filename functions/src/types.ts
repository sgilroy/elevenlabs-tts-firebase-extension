import { ElevenLabsClient } from "elevenlabs";

export type GenerateAudioRequest = ElevenLabsClient.GeneratAudioBulk & {
  voice?: string;
};
