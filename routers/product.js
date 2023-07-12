const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const multer = require("multer");

const {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct,
  productCount,
  featuredProducts,
  productImageGalleryUpdate,
} = require("../controllers/product");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

//routers without authentication
router.route("/").get(getProducts);

router.route("/:id").get(getProduct);

router.route("/get/featured/:count").get(featuredProducts);

//routers with authentication
router.get("/get/count", authentication, productCount);

router.post("/", authentication, uploadOptions.single("image"), createProduct);

router.patch(
  "/galleryimages/:id",
  authentication,
  uploadOptions.array("images", 10),
  productImageGalleryUpdate
);

router.delete("/:id", authentication, deleteProduct);

router.patch("/:id", authentication, updateProduct);

module.exports = router;
