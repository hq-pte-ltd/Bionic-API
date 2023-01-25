const express = require("express");
const cors = require("cors");

const url = require("url");
const path = require("path");
require("dotenv").config();
// const { exec } = require("child_process");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.enable("trust proxy");

app.use((req, res, next) => {
  app.get("X-Forwarded-Proto") != "http"
    ? next()
    : res.redirect("https://" + req.headers.host + req.url);
});

app.use(cors());
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const pdfCoApiKey =
  process.env.PDFCOAPIKEY ||
  "tetannuz@gmail.com_06afec6ab72c8477278a19818d03fba37fa02057fc86e1234d6904363699f7e442e83b5a";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);

const pdfToBionicWithApi = require("./src/parser/pdfToBionicWithApi");
const pdfToBionicNoApi = require("./src/parser/pdfToBionicNoApi");

app.get("/", (req, res) => {
  res.send("Hey Bionic!");
});

app.post("/api/bionic", async (req, res) => {
  try {
    const files = await pdfToBionicNoApi(req.body.url);
    const filename = path.posix.basename(
      url.parse(req.body.url).pathname,
      ".pdf"
    );

    if (files.error) {
      const status =
        typeof files.status !== "number" ? files.errorCode : files.status;
      return res.status(status).json(files);
    }

    // const pdfRef = ref(storage, `bionic_files/${filename}.pdf`);
    // const pdfSnapshot = await uploadBytes(pdfRef, files.pdf);
    // const pdfUrl = await getDownloadURL(pdfSnapshot.ref);

    const htmlRef = ref(storage, `bionic_files/${filename}.html`);
    const htmlSnapshot = await uploadBytes(htmlRef, files.html);
    const htmlUrl = await getDownloadURL(htmlSnapshot.ref);

    console.log("Uploaded.");
    res.status(201).json({ htmlUrl });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: true,
      message:
        "Error occurred while converting or uploading. Please view server logs for more details.",
    });
  }
});

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Listening on :${port}`);
});
