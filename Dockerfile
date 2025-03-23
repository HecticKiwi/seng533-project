# Use Node.js as the base image
FROM node:18

# Install Java (required for Firebase Emulator)
RUN apt-get update && apt-get install -y openjdk-17-jre-headless

# Set the working directory
WORKDIR /app

# Install Firebase CLI globally
RUN npm install -g firebase-tools

# Copy Firebase project files (if needed)
COPY . .

# Expose Firebase emulator ports
EXPOSE 4000 4500 5000 5001 8080 8085 9099 9199 9229

# Default command to start Firebase Emulator
CMD ["firebase", "emulators:start", "--only", "firestore,auth,functions"]