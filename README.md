## KAFKA

```
docker run -d  \
  --name broker \
  -e KAFKA_NODE_ID=1 \
  -e KAFKA_PROCESS_ROLES=broker,controller \
  -e KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://195.35.9.203:9092 \
  -e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
  -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@195.35.9.203:9093 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  -e KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=1 \
  -e KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1 \
  -e KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=0 \
  -e KAFKA_NUM_PARTITIONS=3 \
  -p 9092:9092 \
  -p 9093:9093 \
  apache/kafka:latest
```

## POSTGRES

```docker run --name postgres -e POSTGRES_PASSWORD=testpassword -p 5432:5432 -d postgres```

## REDIS

```
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 -v /local-data/:/data redis/redis-stack:latest
```


docker exec --workdir /opt/kafka/bin/ -it broker sh
./kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic stock-updates --from-beginning
bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic stock-updates



