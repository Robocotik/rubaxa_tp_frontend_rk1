var a = {
  count: -1,
  valueOf: function () {
    this.count++;
    return this.count % 2;
  },
};

// Проверка
console.log(a == a); // true
console.log(a < a); // true
