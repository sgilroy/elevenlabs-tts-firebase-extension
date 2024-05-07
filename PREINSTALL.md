This extension converts text from Firestore documents into speech using the ElevenLabs Text-to-Speech API. This extension is modeled after the Text to Speech extension from the Google Cloud team, but uses ElevenLabs API instead of the Google Cloud Text-to-Speech API.

Upon install you will be asked to provide a Firestore collection path, a Storage path, and an ElevenLabs API key. Any document writes to this collection will trigger a Cloud Function that does the following:

- Generates an audio version of the text using the specified ElevenLabs voice
- Stores the audio file in Cloud Storage at the specified path
- Writes the path to the Storage object back in the same Firestore document

# Billing

Through the use of the ElevenLabs API (as made possible by the API key you provide), this extension will incur costs which will be billed to your ElevenLabs account and will not be visible in the Google Cloud Console or Firebase Console.

To install an extension, your project must be on the Blaze (pay as you go) plan.

You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).

This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service's no-cost tier:

- Cloud Firestore
- Cloud Storage
- Cloud Functions (Node.js 18+ runtime. See [FAQs](https://firebase.google.com/support/faq#extensions-pricing))
