import { ElevenLabsClient } from "elevenlabs";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as stream from "stream";
import config from "./config";
import { GenerateAudioRequest } from "./types";
import { buildRequest, BuildRequestOptions, getFileExtension } from "./util";

const logger = functions.logger;

admin.initializeApp();

const elevenlabs = new ElevenLabsClient({
  apiKey: config.elevenLabsApiKey, // Defaults to process.env.ELEVENLABS_API_KEY
});

logger.log("Initializing text-to-speech extension with config:", config);

export const elevenLabsTextToSpeech = functions.firestore
  .document(`${config.collectionPath}/{docId}`)
  .onCreate(async (snap) => {
    if (snap.data().text) {
      const { text, outputFormat, modelId, voice } = snap.data() as BuildRequestOptions;

      const request = config.enablePerDocumentOverrides
        ? buildRequest({
            text,
            outputFormat,
            modelId,
            voice,
          })
        : buildRequest({ text });

      const stream = await processText(request);
      if (stream) {
        const fileExtension = getFileExtension(outputFormat || config.outputFormat);

        const fileName = config.storagePath
          ? `${config.storagePath}/${snap.id}${fileExtension}`
          : `${snap.id}${fileExtension}`;

        const bucket = admin.storage().bucket(config.bucketName);

        const file = bucket.file(fileName);

        await new Promise<void>((resolve, reject) => {
          stream.pipe(file.createWriteStream()).on("error", reject).on("finish", resolve);
        });

        await snap.ref.update({
          audioPath: `gs://${bucket.name}/${fileName}`,
        });

        return;
      } else {
        logger.error("No audio stream returned from ElevenLabs");
        await snap.ref.update({
          generatingAudioFailed: true,
        });
      }
    }
    return;
  });

async function processText(request: GenerateAudioRequest) {
  let response: stream.Readable;

  // Performs the text-to-speech request
  try {
    logger.log("Generating audio with request:", request, { maxRetries: config.maxRetries });
    response = await elevenlabs.generate(request, { maxRetries: config.maxRetries });
  } catch (e) {
    logger.error(e);
    throw e;
  }
  return response;
}
