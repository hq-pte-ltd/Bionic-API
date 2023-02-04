const pdfToBionicNoApi = require("../src/parser/pdfToBionicNoApi");
const path = require("path");
const {
  collection,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  getDocs,
  get,
} = require("firebase/firestore");
const {
  ref,
  uploadBytes,
  getDownloadURL,
  storage,
  db,
} = require("../services/firebase.service");

const url = require("url");

class BionicController {
  constructor() {}

  async test(req, res) {
    const usersRef = collection(db, "user");
    const q = query(usersRef, orderBy("dateSubscription"));
    let i = 0;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (i === 5) {
        return res.status(200).json({ message: "Hello Bionic" });
      }
      console.log(doc.id, " => ", doc.data());
      i++;
    });
    return res.status(200).json({ message: "Hello Bionic" });
  }

  async convertToBionic(req, res) {
    try {
      const { styles, fileName } = req.body;
      const files = await pdfToBionicNoApi(req.body.url, styles);

      if (files.error) {
        const status =
          typeof files.status !== "number" ? files.errorCode : files.status;
        return res.status(status).json(files);
      }

      const name = fileName.split(".").slice(0, -1).join(".") + "_CONVERTED_BY_READGRASP.COM";

      const htmlRef = ref(storage, `bionic_files/${name}.html`);
      const htmlSnapshot = await uploadBytes(htmlRef, files.html);
      const htmlUrl = await getDownloadURL(htmlSnapshot.ref);

      console.log("Uploaded.");
      return res.status(201).json({ htmlUrl });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: true,
        message:
          "Error occurred while converting or uploading. Please view server logs for more details.",
      });
    }
  }
}

module.exports = BionicController;
