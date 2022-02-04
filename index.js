import express from 'express';
import http from 'http';

const app = express();
const http = createServer(app);


const server = http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})