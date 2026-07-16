const express = require("express");
const router = express.Router();
const lecturerController = require("../controllers/lecturerController");

router.get("/test", (req, res) => {
    res.json({ message: "Test route works" });
});

router.get("/topics", lecturerController.getAllTopics);

router.put("/topics/:id", lecturerController.reviewTopic);

module.exports = router;