# ElevenLabs Text-to-Speech Firebase Extension

**Author**: Scott Gilroy (https://github.com/sgilroy)

**Description**: Converts Firestore documents to audio files stored in Cloud Storage using ElevenLabs generative voice AI.

**Details**: This extension converts text from Firestore documents into speech using the ElevenLabs Text-to-Speech API. This extension is modeled after the Text to Speech extension from the Google Cloud team, but uses ElevenLabs API instead of the Google Cloud Text-to-Speech API. Upon install you will be asked to provide a Firestore collection path, a Storage path, and an ElevenLabs API key. Any document writes to this collection will trigger a Cloud Function that does the following:

- Generates an audio version of the text using the specified ElevenLabs voice
- Stores the audio file in Cloud Storage at the specified path
- Writes the path to the Storage object back in the same Firestore document

Note: this is a third-party extension and is not officially supported by ElevenLabs or by Google.

## Features

- **Realistic Voice Synthesis**: ElevenLabs offers highly realistic AI-generated voices that can bring text to life in a natural way. This extension allows easily generating lifelike speech from text stored in Firestore.
- **Customized Voices**: Choose from a variety of expressive AI voices to best match the tone and style of your text content. Tailor the speech output to your specific use case.
- **Scalable Voice Generation**: Automatically trigger voice synthesis on Firestore document changes, allowing seamless conversion of large amounts of text to speech at scale.

## Additional Setup

Before installing this extension, make sure that you've set up a [Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) and [Cloud Storage bucket](https://firebase.google.com/docs/storage) in your Firebase project.

You'll also need to sign up for an [ElevenLabs](https://elevenlabs.io/) account and obtain an API key to use this extension.

## Billing

Through the use of the ElevenLabs API (as made possible by the API key you provide), this extension will incur costs which will be billed to your ElevenLabs account and will not be visible in the Google Cloud Console or Firebase Console.

To install an extension, your project must be on the Blaze (pay as you go) plan.

You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).

This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service's no-cost tier:

- Cloud Firestore
- Cloud Storage
- Cloud Functions (Node.js 18+ runtime. See [FAQs](https://firebase.google.com/support/faq#extensions-pricing))

## Configuration Parameters

- Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).
- ElevenLabs API key: Your ElevenLabs API key
- Collection path: The Firestore collection path that contains documents with text to convert to speech
- Storage bucket name: The Cloud Storage bucket where converted speech audio files will be stored
- Storage path: The path in the Storage bucket where audio files will be saved (defaults to bucket root)
- Output format: The format of the audio file to generate (defaults to MP3)
- Model ID: The ID of the ElevenLabs model to use for speech synthesis
- Voice: The ID of the ElevenLabs voice to use for speech synthesis
- Enable per document overrides: If set to \"Yes\", options for converting audio will be overwritten by fields in the document containing the text to be converted.

## Cloud Functions

- `elevenLabsTextToSpeech`: Processes document changes in the specified Firestore collection, generating speech audio files using ElevenLabs and saving them to Cloud Storage

## APIs Used

- ElevenLabs Text-to-Speech API (https://elevenlabs.io/docs/api-reference/text-to-speech): Used to generate natural-sounding speech audio from text in Firestore documents

## Access Required

This extension will operate with the following project IAM roles:

- `datastore.user` (Reason: Allows reading text from and writing audio paths to Cloud Firestore documents)
- `storage.objectAdmin` (Reason: Allows writing generated speech audio files to Cloud Storage)
