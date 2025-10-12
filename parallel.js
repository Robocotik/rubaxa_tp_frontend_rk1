// Параллельные вычисления

function parallel(tasks, onAllResolved) {
  const results = new Array(tasks.length);
  let completed = 0;

  if (tasks.length === 0) {
    onAllResolved(results);
    return;
  }

  tasks.forEach((task, index) => {
    if (task.length === 0) {
      setTimeout(() => {
        results[index] = task();
        completed++;
        if (completed === tasks.length) onAllResolved(results);
      }, 0);
    } else {
      task(result => {
        results[index] = result;
        completed++;
        if (completed === tasks.length) onAllResolved(results);
      });
    }
  });
}

parallel(
  [
    function (resolve) {
      resolve(10);
    },
    function () {
      return 5;
    },
    function (resolve) {
      setTimeout(function () {
        resolve(0);
      }, 10);
    },
  ],
  function (results) {
    console.log(results); // [10, 5, 0]
  },
);
