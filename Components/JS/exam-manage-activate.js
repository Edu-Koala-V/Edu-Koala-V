const examActivateDetails = document.querySelectorAll(
  ".activate-classes>details"
);

examActivateDetails.forEach((details) => {
  details.querySelectorAll("input[name=checkAllStudents]").forEach((input) => {
    input.addEventListener("change", () => {
      details.querySelectorAll(".studentActivateBox").forEach((student) => {
        student.children[1].checked = input.checked;
      });
    });
  });
  applyExamButton(details);
  setupOldSetTimePlusCheckbox(details);
});

function applyExamButton(details) {
  // console.log(details);
  // console.log(details.querySelector(".apply-exam"));
  details.querySelector(".apply-exam").addEventListener("click", (event) => {
    const examID = event.target.getAttribute("data-quiz-id");
    const classID = event.target.getAttribute("data-class-id");

    const students = [];

    const settingExamTimeInput = details.querySelector(
      "input[name='examTime']"
    );
    const settingExTimeInput = details.querySelector("input[name='exTime']");

    const timeExamValueBase = parseInt(settingExamTimeInput.value);
    const timeExamValuePlus = parseInt(settingExTimeInput.value);
    details
      .querySelectorAll(".studentActivateBox")
      .forEach((student, index) => {
        const studentInput = student.querySelectorAll(
          "input[type='checkbox']"
        )[1];

        if (!studentInput.checked) {
          return;
        }

        const extendedTimeInput = student.querySelector(
          ".extendedTime input[type='checkbox']"
        );
        const approachTwoInput =
          student.parentElement.parentElement.querySelectorAll(
            ".approach_two input[type='checkbox']"
          )[index];

        students.push([
          studentInput.id.replace("student_", ""),
          extendedTimeInput.checked
            ? timeExamValueBase + timeExamValuePlus
            : timeExamValueBase,
          approachTwoInput.checked ? true : false,
        ]);
      });
    sendDataToServer(
      { classID: classID, students: students },
      "/aktywacja-egzaminu/" + examID
    ).then((data) => {
      if (data) {
        createNotification("Koala-V   Udało się: ", data.message, data.status);
      }
    });
  });
}

function setupOldSetTimePlusCheckbox(details){
    const dataTimeInInputs = details.querySelectorAll(".extendedTime input[type='checkbox']");
    const dataTime = [];
    dataTimeInInputs.forEach((input) => {
    if(input.getAttribute("data-time")){
        dataTime.push(parseInt(input.getAttribute("data-time")));
    }
    });
    if(dataTime.length === 0){
        return;
    }
    const maxTime = Math.max(...dataTime);
    const minTime = Math.min(...dataTime);

    const settingExamTimeInput = details.querySelector("input[name='examTime']");
    const settingExTimeInput = details.querySelector("input[name='exTime']");

    settingExamTimeInput.value = minTime;
    settingExTimeInput.value = maxTime-minTime;


    dataTimeInInputs.forEach((input) => {
        if(!input.getAttribute("data-time")){
            input.setAttribute("data-time", minTime);
        }
        if(parseInt(input.getAttribute("data-time")) > minTime){
            input.setAttribute("disabled", "disabled");
            input.checked = true;
            input.nextSibling.textContent += " + " + (parseInt(input.getAttribute("data-time")) - minTime) + " min";
        }
    });
    
} 


