// Параллельные вычисления

function getWorkerCode(task) {
  return `
      onmessage = function(e) {
        const task = ${task};
        task((result) => {
            postMessage({ index: e.data.index, result: result }); 
      })};
    `;
}

function parallel(tasks, onAllResolved) {
  const results = new Array(tasks.length);
  let completed = 0;

  if (tasks.length === 0) {
    onAllResolved(results);
    return;
  }

  tasks.forEach((task, index) => {
    if (task.length === 0) {
      results[index] = task();
      completed++;
      if (completed === tasks.length) onAllResolved(results);
    } else {
      let syncCompleted = false; 
      // этот ужас существует, потому что в тестах
      //на sync существуют обычные sync callback и мы никак не можем узнать, 
      // что это не async callback пока не проверим

      task(result => {
        syncCompleted = true;
        results[index] = result;
        completed++;
        if (completed === tasks.length) onAllResolved(results);
      });

      setTimeout(() => {
        if (!syncCompleted) {
          const workerCode = getWorkerCode(task);
          const blob = new Blob([workerCode], {type: 'application/javascript'});
          const blobUrl = URL.createObjectURL(blob);
          const worker = new Worker(blobUrl);

          worker.onmessage = function (e) {
            if (!syncCompleted) {
              syncCompleted = true;
              results[e.data.index] = e.data.result;
              completed++;
              worker.terminate();
              URL.revokeObjectURL(blobUrl);
              if (completed === tasks.length) onAllResolved(results);
            }
          };

          worker.postMessage({index: index});
        }
      }, 0);
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
