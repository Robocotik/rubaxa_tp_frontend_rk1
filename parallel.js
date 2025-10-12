// Параллельные вычисления

function getWorkerCode(task) {
  return `
      onmessage = function(e) {
        const task = ${task};
        if (task.length > 0) {
          task((result) => {
            postMessage({ index: e.data.index, result: result }); // поддерживаем порядок, в котором у нас запускались функции
          });
        } else {
          postMessage({ index: e.data.index, result: task() });
        }
      };
    `;
}

function parallel(tasks, onAllResolved) {
  const results = new Array(tasks.length);
  let completed = 0;

  tasks.forEach((task, index) => {
    const workerCode = getWorkerCode(task);
    const blob = new Blob([workerCode], {type: 'application/javascript'});
    const blobUrl = URL.createObjectURL(blob);
    const worker = new Worker(blobUrl);

    worker.onmessage = function (e) {
      results[e.data.index] = e.data.result;
      completed++;

      worker.terminate();
      URL.revokeObjectURL(blobUrl);

      if (completed === tasks.length) {
        onAllResolved(results);
      }
    };

    worker.postMessage({index: index});
  });
}

parallel(
  [
    function (resolve) {
      setTimeout(function () {
        resolve(10);
      }, 50);
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
