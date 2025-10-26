const fs = require('fs');
const path = require('path');

// Create .env.local file with example values
const envContent = `# Database
MONGODB_URI=mongodb://localhost:27017/vedit-ai
# OR for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/vedit-ai

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google/YouTube OAuth (either pair works; backend checks both)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file with example values');
  console.log('📝 Please update the values in .env.local with your actual credentials');
} else {
  console.log('⚠️  .env.local already exists, skipping creation');
}

console.log('\n🚀 Next steps:');
console.log('1. Update .env.local with your actual API keys');
console.log('2. Run: npm run dev');
console.log('3. Open: http://localhost:3000');
