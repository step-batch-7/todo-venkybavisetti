const focusOnSubTask = function() {
  document.querySelector('.subTaskText').focus();
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
        <span 
          contenteditable class="subTaskText"
          spellcheck = "false"
          onfocusout="editSubTask(${task.id},${subTask.id})"
        >
          ${subTask.text}
        </span>
      </div>
      <div class = "subTaskImages">
      <span style='margin-top:2px'><img src="images/edit.svg" height ="18px" onclick="focusOnSubTask()"/></span>
      <img 
        src="images/cancel.svg"
        onclick="removeSubTask(${task.id},${subTask.id})" height ="22px"
      />
      </div>
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

const addSubTask = function(task) {
  const subTaskAdderHtml = `<div class="subTaskAdder">
  <input 
    type="text" 
    name="title" 
    class="subTaskInput" 
    placeholder="Tasks..."
  />
  <button 
    onclick="addNewSubTask(${task.id})"
    class="subTaskButton"
  >
  <img src="images/add.svg" height="30px"/>
  </button>
</div>`;
  return convertHtmlToNode(subTaskAdderHtml);
};
