// Реализовать свойство size у всех массивов,
// которое работало бы точно так же, как и length.

const countArraySize = (arr) => {
  let size = 0;
  for (let i of arr) {
    size++;
  }
  return size;
};

Object.defineProperty(Array.prototype, "size", {
  get: function () {
    return countArraySize(this);
  },
  set: function (newSize) {
    if (newSize < 0 || newSize % 1 !== 0 || newSize > Math.pow(2, 32)) {
      throw new RangeError();
    }
    const curSize = countArraySize(this);
    if (curSize > newSize) {
      this.splice(newSize, curSize - newSize);
    } else if (curSize < newSize) {
      for (let i = curSize; i < newSize; i++) {
        this[i] = undefined;
      }
    }
  },
});

// #1
console.log([0, 1].size); // 2

// #2
var arr = [0, 1, 2];
arr.size = 0;
console.log(arr); // []

// дополнительные проверки
console.log(Array(3).size); // 3
console.log([1, , 2].size); // 3
