var a = {
  count: -1,
  valueOf: function () {
    this.count++;
    return this.count;
  },
};

// Проверка
console.log(a == a); // true
console.log(a < a); // true
