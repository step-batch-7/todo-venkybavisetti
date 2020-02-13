const focusOnSubTask = function() {
  document.querySelector('.subTaskText').focus();
};

const subTaskTitle = function(task, subTask) {
  return `<span 
  contenteditable class="subTaskText"
  spellcheck = "false"
  onfocusout="editSubTask(${task.id},${subTask.id})"
>
  ${subTask.text}
</span>`;
};

const subTaskOption = function(task, subTask) {
  return `<div class = "subTaskImages">
  <img class="editIcon" src="images/edit.svg" onclick="focusOnSubTask()"/>
  <img 
    src="images/cancel.svg" class="deleteIcon"
    onclick="removeSubTask(${task.id},${subTask.id})"   />
  </div>`;
};

const getSubTasksList = function(task) {
  const subTaskHtml = function(subTaskList, subTask) {
    const subTaskHtml = `<li 
      ${getClass(subTask.done)} 
      id="${task.id}_${subTask.id}"
    >
      <div >
        <input 
          type="checkbox" 
          ${isChecked(subTask.done)} 
          onclick="toggleDone(${task.id},${subTask.id})"
        >
        ${subTaskTitle(task, subTask)}
      </div>
      ${subTaskOption(task, subTask)}
    </li>`;
    subTask.done
      ? subTaskList.push(subTaskHtml)
      : subTaskList.unshift(subTaskHtml);
    return subTaskList;
  };
  return task.tasks.reduce(subTaskHtml, []).join('');
};

const createSubTask = function(task) {
  const subTaskHtml = `<div class="subTaskList">
  ${getSubTasksList(task)}
  </div>`;
  return convertHtmlToNode(subTaskHtml);
};

const addButton = function(taskId) {
  return `<button onclick="addNewSubTask(${taskId})" class="subTaskButton">
    <img src="images/add.svg" height="30px" />
  </button>`;
};

const addSubTask = function(task) {
  const subTaskAdderHtml = `<div class="subTaskAdder">
  <input 
    type="text" 
    name="title" 
    class="subTaskInput" 
    placeholder="Tasks..."
  />
  ${addButton(task.id)}
</div>`;
  return convertHtmlToNode(subTaskAdderHtml);
};
