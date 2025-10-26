# rubaxa_tp_frontend_rk1

# roman numbers

## Пояснение

решение универсально для любого римского числа, так что выглядит муторно со стороны, но это не совсем так.

```
// с помощью Proxy перехватываем событие обращения к свойству у Number.prototype (get свойство)
const numberProxy = new Proxy(Number.prototype, { 
  get(target, prop, receiver) { 
    // проверяем с помощью регулярки, что у нас тут Римское число
    if (typeof prop === 'string' && /^[IVXLCDM]+$/.test(prop)) {
      const end = romanToInt(prop);
      const start = Number(receiver.valueOf());
      // после перехвата get возращаем уже наш массив
      return Array.from({length: end - start}, (v, k) => k + start);
    }
    // если число не римское вызываем базовое поведение get у Number.Prototype
    return Reflect.get(target, prop, receiver);
  },
});

// тк мы не можем просто взять и написать Number.prototype = new Proxy(Number.prototype, ....)
// (т.к. он не изменяемый), мы установим прототип для Number.prototype в виде numberProxy.
Object.setPrototypeOf(Number.prototype, numberProxy);
```