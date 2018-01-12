const amqp = require('amqplib/callback_api');
const fs = require('fs');

const img = './images/baske.png';

const uvBuffer = fs.readFileSync(img, null).buffer;

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        const q = 'render_queue';

        ch.assertQueue(q, { durable: false });
        // Note: on Node 6 Buffer.from(msg) should be used
        ch.sendToQueue(q, new Buffer(uvBuffer), { replyTo: 'back', correlationId: '1' });
        console.log(" [x] Sent %s", uvBuffer);
    });

    conn.createChannel((err, ch) => {
        const q = 'back';

        ch.assertQueue(q, { durable: false });
        // Receiving
        ch.consume(q, msg => {
            console.log(" [x] Received %s", msg.content.toString());
        }, { noAck: true });

    });
});