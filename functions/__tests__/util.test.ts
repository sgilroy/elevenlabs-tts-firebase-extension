import { buildRequest, getFileExtension } from "../src/util";

describe("buildRequest", () => {
  it("uses ElevenLabs SDK camelCase request fields", () => {
    expect(
      buildRequest({
        text: "Hello from Firestore",
        outputFormat: "mp3_44100_128",
        modelId: "eleven_multilingual_v2",
        voice: "Rachel",
      }),
    ).toEqual({
      text: "Hello from Firestore",
      outputFormat: "mp3_44100_128",
      modelId: "eleven_multilingual_v2",
      voice: "Rachel",
    });
  });

  it("falls back to extension defaults when optional values are empty", () => {
    expect(buildRequest({ text: "Hello" })).toEqual({
      text: "Hello",
      outputFormat: "mp3_44100_128",
      modelId: "eleven_multilingual_v2",
      voice: "Rachel",
    });
  });
});

describe("getFileExtension", () => {
  it.each([
    ["mp3_22050_32", ".mp3"],
    ["mp3_44100_192", ".mp3"],
    ["pcm_16000", ".pcm"],
    ["pcm_44100", ".pcm"],
    ["ulaw_8000", ".ulaw"],
    ["unknown", ".mp3"],
  ])("returns %s extension", (outputFormat, expectedExtension) => {
    expect(getFileExtension(outputFormat)).toBe(expectedExtension);
  });
});
