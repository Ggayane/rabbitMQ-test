const amqp = require('amqplib/callback_api');
const fs = require('fs');

const img = './images/baske.png';
const sendTo = 'render_queue';
const replyTo = 'back';

const uvBuffer = fs.readFileSync(img, null).buffer;
const sendingData = new Buffer(uvBuffer);


amqp.connect('amqp://localhost', (err, conn) => {
    // Sending channel
    conn.createChannel((err, ch) => {
        ch.assertQueue(sendTo, { durable: false });
        ch.sendToQueue(sendTo, sendingData, { replyTo, correlationId: '1' });
        console.log(" [x] Sent %s", uvBuffer);
    });

    // Receiving channel
    conn.createChannel((err, ch) => {
        ch.assertQueue(replyTo, { durable: false });
        ch.consume(replyTo, msg => {
            console.log(" [x] Received %s", msg.content.toString());
        }, { noAck: true });
    });
});