import * as dotenv from "dotenv";
const path = require("path");

(async function () {
  dotenv.config({
    path: path.resolve(
      __dirname,
      "../../_emulator/extensions/elevenlabs-tts-firebase-extension.env.local"
    ),
  });

  process.env.EXT_INSTANCE_ID = "elevenlabs-tts-firebase-extension";
  process.env.GOOGLE_CLOUD_PROJECT = "demo-gcp";
  process.env.GCLOUD_PROJECT = "demo-gcp";
  process.env.PROJECT_ID = "demo-gcp";
})();
