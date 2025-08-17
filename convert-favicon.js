const sharp = require("sharp");

sharp("src/images/favicon.svg")
  .resize(512, 512)
  .png()
  .toFile("src/images/favicon.png")
  .then(() => console.log("Favicon PNG created successfully!"))
  .catch(err => console.error(err));
