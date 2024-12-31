import kafka from "./init.js";

function createConsumer(groupId = "client") {
  return kafka.consumer({ groupId });
}

export {createConsumer} ;
