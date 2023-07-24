const config = {
  app: {
    GC_API: "https://classroom.googleapis.com/v1",
  },
  db: {
    DB_URI:"mongodb+srv://admin:PeerLearning@cluster0.tgwbw4t.mongodb.net/peerlearning?retryWrites=true&w=majority"
    },
};

console.log("Hello!");
module.exports = config;