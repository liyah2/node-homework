const { sanitize } = require("express-xss-sanitizer");
const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");

const taskCounter = (() => {
  let lastTaskNumber = 0;

  return () => {
    lastTaskNumber += 1;
    return lastTaskNumber;
  };
})();

function create(req, res) {
  const { error, value } = taskSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const task = {
    id: taskCounter(),
    title: value.title,
    isCompleted: false,
    userId: global.user_id.email,
  };

  global.tasks.push(task);

  const { userId, ...sanitizedTask } = task;

  return res.status(201).json(sanitizedTask);
}

//////Index////

function index(req, res) {
  const userTasks = global.tasks.filter(
    (task) => task.userId === global.user_id.email
  );

  if (userTasks.length === 0) {
    return res.sendStatus(404);
  }

  const sanitizedTasks = userTasks.map((task) => {
    const { userId, ...sanitizedTask } = task;

    return sanitizedTask;
  });

  return res.status(200).json(sanitizedTasks);
}

//show//

function show(req, res) {
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  const task = global.tasks.find(
    (task) => task.id === taskId && task.userId === global.user_id.email
  );

  if (!task) {
    return res.sendStatus(404);
  }

  const { userId, ...sanitizedTask } = task;

  return res.status(200).json(sanitizedTask);
}

//update//

function update(req, res) {
  if (!req.body) {
    req.body = {};
  }

  const { error, value } = patchTaskSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  const task = global.tasks.find(
    (task) => task.id === taskId && task.userId === global.user_id.email
  );

  if (!task) {
    return res.sendStatus(404);
  }

  Object.assign(task, value);

  const { userId, ...sanitizedTask } = task;

  return res.status(200).json(sanitizedTask);
}

//delete//

function deleteTask(req, res) {
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  const taskIndex = global.tasks.findIndex(
    (task) => task.id === taskId && task.userId === global.user_id.email
  );

  if (taskIndex === -1) {
    return res.sendStatus(404);
  }

  const { userId, ...sanitizedTask } = global.tasks[taskIndex];

  global.tasks.splice(taskIndex, 1);

  return res.status(200).json(sanitizedTask);
}

module.exports = {
  create,
  index,
  show,
  update,
  deleteTask,
};
