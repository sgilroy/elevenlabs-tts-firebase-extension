import { ElevenLabs } from "@elevenlabs/elevenlabs-js";

export type GenerateAudioRequest = ElevenLabs.BodyTextToSpeechFull & {
  voice?: string;
};
