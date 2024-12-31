import kafka from "./init.js";

const producer = kafka.producer({
    "batch.size": 100000,
});

export default producer;