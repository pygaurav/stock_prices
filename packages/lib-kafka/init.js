import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "stock-app",
  brokers: ["195.35.9.203:9092"],
});

export default kafka;