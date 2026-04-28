## Version 1.2.1

- Update the Cloud Functions runtime configuration to Node.js 22.

## Version 1.2.0

- Add a param `ENABLE_UPDATES` (defaults to yes) to enable/disable generating
  speech audio for Firestore documents which already have an `audioPath` field.
- Redact the ElevenLabs API key from startup logs and log safer error details.
- Update dependencies to address known npm vulnerabilities, including migrating
  to the current `@elevenlabs/elevenlabs-js` SDK package.

## Version 1.0.0

- Initial release of the _ElevenLabs TTS_ extension.

## Version 1.0.1

- Add missing required fields to the `extension.yaml` file.

## Version 1.1.0

- Add a param `ENABLE_UPDATES` (defaults to yes) to enable/disable generating
  speech audio for Firestore documents which already have an `audioPath` field.
