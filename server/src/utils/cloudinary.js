const { v2: Cloudinary } = require('cloudinary');


Cloudinary.config({ 
  cloud_name: 'c4benn', 
  api_key: '336555747421799', 
  api_secret: '0TtMTNIreV2Ljo7S1Binntv8dc0',
  secure: true
});

module.exports = Cloudinary