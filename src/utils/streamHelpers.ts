import { Readable } from "stream";
import { IncomingMessage } from "http";
import { IncomingForm } from "formidable";

function readableStreamToIncomingMessage(
  readableStream: ReadableStream<Uint8Array> | null
): IncomingMessage {
  if (!readableStream) {
    throw new Error("Request body is null");
  }

  const reader = readableStream.getReader();

  // Create a Readable stream compatible with Node.js and IncomingMessage
  const nodeStream = new Readable({
    read() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            this.push(null); // Indicate the end of the stream
          } else {
            this.push(Buffer.from(value)); // Push the chunk to the readable stream
          }
        })
        .catch((err) => {
          this.destroy(err); // Handle any read errors
        });
    },
    destroy(err, callback) {
      reader.cancel(); // Clean up the reader if there's an error
      callback(err);
    }
  });

  // Attach minimal properties to simulate IncomingMessage behavior
  const incomingMessage = nodeStream as IncomingMessage;
  incomingMessage.headers = {}; // Optionally add headers
  incomingMessage.method = "POST"; // Set method as POST
  incomingMessage.url = "/api/auth/register"; // Set endpoint URL

  return incomingMessage;
}

// Endpoint API
export async function POST(req: Request) {
  try {
    // Check if request body is null
    if (!req.body) {
      return new Response(JSON.stringify({ error: "Request body is null" }), { status: 400 });
    }

    // Convert ReadableStream to IncomingMessage
    const incomingMessage = readableStreamToIncomingMessage(req.body);

    const form = new IncomingForm({
      keepExtensions: true,
      uploadDir: "./public/uploads"
    });

    return new Promise<Response>((resolve) => {
      form.parse(incomingMessage, async (err, fields, files) => {
        if (err) {
          console.error("Error parsing form data:", err);
          return resolve(
            new Response(JSON.stringify({ error: "Error parsing form data" }), { status: 400 })
          );
        }

        // checking
        console.log(fields);
        console.log(files);

        // Implement data processing logic
        resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
      });
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(JSON.stringify({ error: "Error handling request" }), { status: 500 });
  }
}

export default readableStreamToIncomingMessage;
