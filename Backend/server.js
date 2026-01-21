const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectToMongodb = require('./db/connectToMongodb');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {app,server,io} = require('./socket/socket');


const authRoutes = require('./routes/authroutes');
const messageRoutes = require('./routes/messageroutes');
const userRoutes = require('./routes/userroutes');

// const __dirname = path.resolve();  // absolute path of root folder already available globally if type is not module like in my case 
// __dirname will resolve to RealTime-Chatapp/Backend since server.js is located in Backend/


dotenv.config();
// console.log("port " ,process.env.PORT); // Should log the value from the `.env` file
// console.log("mongodb uri" ,process.env.MONGO_DB_URI); // Should log your MongoDB URI

const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser()); // to parse the incoming requests with cookies (from req.cookies)

// Enable CORS for frontend (http://localhost:3000)
// app.use(cors({ origin: 'http://localhost:3000' }));



app.use("/api/auth",authRoutes) 
app.use("/api/messages",messageRoutes) 
app.use("/api/users",userRoutes)







  // npm run build in frontend will put everything of frontend in build folder
  app.use(express.static(path.join(__dirname, '../Frontend/dist')));


  // this we able to run our fronted from server as well 
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../Frontend', 'dist', 'index.html'));
  }
  );

server.listen(PORT, () => {
  connectToMongodb();
  console.log(`Server is running on port ${PORT}`);
});