# Mongo Query Handler

This AWS Lambda Function will operate a mongodatabase collections and docuemnts by executing:
"insert", "findOne", "find", "updateOne", "updateMany", "deleteOne", "deleteMany" commands over it.

## Expected inputs
queryDefinition: {
  query: {
    [
      
    ]
  },
  meta: {
    type: "", // values could be "insert", "findOne", and the rest of posible operations
    collection: ""
  }
}
