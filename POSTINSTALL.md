## See it in action

This extension will automatically convert text from Firestore documents into speech and save the generated audio files in Cloud Storage for Firebase.

To use this extension, ensure that each document in the specified Firestore collection contains a text field with the content you want to convert to speech.

If you enabled per-document overrides during installation, you can also include fields such as outputFormat and voice in the document for customization.

## Customization Fields

If per-document overrides are enabled, you can include the following optional fields in your Firestore documents to customize the generated audio:

- `outputFormat`: The format of the generated audio file (e.g., "mp3_22050_32", "wav_16000_16"). See the ElevenLabs API documentation for supported formats.
- `voice`: The name or ID of the voice to use for text-to-speech (e.g., "Clyde", "lqydY2xVUkg9cEIFmFMU").
- `modelId`: The ID of the model to use for text-to-speech (e.g., "eleven_multilingual_v2").

## Result Fields

After the text-to-speech process completes, the extension will update the Firestore document with the following fields:

- `status`: Indicates the status of the audio generation process ("done" for success, "failed" for failure).
- `audioPath`: The full path to the generated audio file in Cloud Storage (e.g., "gs://your-bucket/path/to/file.mp3"). Only set on success.
- `audioCreatedAt`: A timestamp indicating when the audio file was created. Only set on success.
- `generatingAudioFailed`: A boolean indicating whether the audio generation process failed. Only set on failure.

## Example Usage

```javascript
admin.firestore().collection("${param:COLLECTION_PATH}").add({
  text: "Hello, world!",
  outputFormat: "mp3_22050_32", // Optional if per-document overrides are enabled
  voice: "Clyde", // Optional if per-document overrides are enabled
});
```

## Access generated audio files

Once the extension is installed, it will automatically process new documents in the ${param:COLLECTION_PATH} collection and store the resulting audio files in your `${param:BUCKET_NAME}`Cloud Storage bucket at the`${param:STORAGE_PATH}` path.

The files will be named using the document ID with an appropriate file extension (e.g., .mp3 for MP3 files).

## Error handling

If there are any errors during the text-to-speech conversion process, the extension will log the error message in the Cloud Functions logs. Make sure to monitor these logs and handle any errors appropriately in your application.

## Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
