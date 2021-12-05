const fs = require("fs");
const path = require("path");

class MyDatabase {
  constructor() {
    const instance = this.constructor.instance;
    if (instance) return instance;
    this.constructor.instance = this;

    console.log(`Initializing database`);
    this.capitals = {};

    let lines = fs
      .readFileSync(path.join(__dirname, "capitals.txt"))
      .toString()
      .split("\n");

    for (let i = 0; i < lines.length; ++i) {
      this.capitals[lines[i]] = parseInt(lines[i + 1]);
    }
  }

  getPopulation(city) {
    return this.capitals[city];
  }
}

// low-level module

// high-level module
class SingletonRecordFinder {
  totalPopulation(cities) {
    return cities
      .map((city) => new MyDatabase().getPopulation(city))
      .reduce((x, y) => x + y, 0);
  }
}

class ConfigurableRecordFinder {
  constructor(database = new MyDatabase()) {
    this.database = database;
  }

  totalPopulation(cities) {
    return cities
      .map((city) => this.database.getPopulation(city))
      .reduce((x, y) => x + y, 0);
  }
}

class DummyDatabase {
  constructor() {
    this.capitals = {
      alpha: 1,
      beta: 2,
      gamma: 3,
    };
  }

  getPopulation(city) {
    return this.capitals[city];
  }
}

const db1 = new MyDatabase();
const db2 = new MyDatabase();
console.log("db1 is equal to db2 : ", db1 === db2);

let rf = new SingletonRecordFinder();
let cities = ["Seoul", "Mexico City"];
let tp = rf.totalPopulation(cities);
console.log(
  "total populate in Seoul and Meico City is Equal : ",
  tp === 17400000 + 17500000
);

let db = new DummyDatabase();
rf = new ConfigurableRecordFinder(db);
console.log(
  "alpha + gamma is equal 4 : ",
  rf.totalPopulation(["alpha", "gamma"]) === 4
);
