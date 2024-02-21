const QueryBuilder = require('./lib/QueryBuilder');

class NL2Mongo {
  constructor() {
    this.secretKeys = {};
  }

  setSecretKeys(keys) {
    this.secretKeys = keys;
  }

  async getQuery(question, option = undefined) {
    return QueryBuilder.handle(question, this.secretKeys).then(response => {
      if (response.startsWith("<!--") && response.endsWith("--!>")) {
        response = response.substring(4, response.length - 4);
      }
      return response;
    })
  }
}

module.exports = new NL2Mongo();
