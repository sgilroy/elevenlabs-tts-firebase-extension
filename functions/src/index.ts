import { ElevenLabsClient } from "elevenlabs";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
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
  .onWrite(async (change) => {
    const before = change?.before?.data();
    const after = change?.after?.data();

    const snap = change.after;
    if (
      snap?.exists &&
      snap?.data().text &&
      (!before || ["text", "outputFormat", "modelId", "voice"].some((p) => before[p] !== after[p])) &&
      // When updates are not enabled, only generate audio if there is no audioPath yet
      (config.enableUpdates || !after.audioPath)
    ) {
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
        const fileExtension = getFileExtension(request.output_format);

        const fileName = config.storagePath
          ? `${config.storagePath}/${snap.id}${fileExtension}`
          : `${snap.id}${fileExtension}`;

        const bucket = admin.storage().bucket(config.bucketName);

        const file = bucket.file(fileName);

        logger.log("Uploading audio to storage with filename:", fileName, {
          includeCustomMetadata: config.includeCustomMetadata,
          cacheControl: config.cacheControl,
        });

        await new Promise<void>((resolve, reject) => {
          stream
            .pipe(
              file.createWriteStream({
                metadata: {
                  // note that we nest "metadata" for our custom metadata
                  ...(config.includeCustomMetadata
                    ? {
                        metadata: {
                          description: "Audio generated by ElevenLabs text-to-speech extension",
                          documentId: snap.id,
                          documentPath: snap.ref.path,
                          text: request.text,
                          voice: request.voice,
                          modelId: request.model_id,
                          outputFormat: request.output_format,
                        },
                      }
                    : {}),
                  ...(config.cacheControl
                    ? {
                        cacheControl: config.cacheControl,
                      }
                    : {}),
                },
              }),
            )
            .on("error", reject)
            .on("finish", resolve);
        });

        logger.log(`Audio uploaded to gs://${config.bucketName}/${fileName}`, { metadata: file.metadata });

        await snap.ref.update({
          status: "done",
          audioPath: `gs://${config.bucketName}/${fileName}`,
          audioCreatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        logger.error("No audio stream returned from ElevenLabs");
        await snap.ref.update({
          status: "failed",
          generatingAudioFailed: true,
        });
      }
    }
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
