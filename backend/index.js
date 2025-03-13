const express = require('express');
const app = express();

const router = require('./routes/index'); 

app.use(express.json());

app.use('/api', router);

app.listen(3000, () => {  
    console.log("Your app is listening on port 3000");
});
