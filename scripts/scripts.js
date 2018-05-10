/* –––––––––––––––––––––––––– GET HTML ELEMENTS –––––––––––––––––––––––––– */
var formSchool = document.getElementById("formSchool");
var inpSchool = document.getElementById("inpSchool");
var tBodySchools = document.getElementById("tBodySchools");

var formSport = document.getElementById("formSport");
var inpSport = document.getElementById("inpSport");
var tBodySports = document.getElementById("tBodySports");

var tBodyTeams = document.getElementById("tBodyTeams");

var formResult = document.getElementById("formResult");
var selTeam = document.getElementById("selTeam");
var inpPoints = document.getElementById("inpPoints");
var tBodyResults = document.getElementById("tBodyResults");


/* –––––––––––––––––––––––––– GET DATABASES –––––––––––––––––––––––––– */
var database = firebase.database();
var schoolsDB = database.ref("schools");
var sportsDB = database.ref("sports");
var teamsDB = database.ref("teams");
var resultsDB = database.ref("results");









/* –––––––––––––––––––––––––– PUSH AND GET DATA –––––––––––––––––––––––––– */
// add new school to schoolsDB
function addSchool(event){

  // control in console
  console.log("testing addSchool");

  // prevent reloading page
  event.preventDefault();

  // get form values
  var school = inpSchool.value;
  inpSchool.value = ""; // clear after submit

  // push new object to schoolsDB with random primary key
  schoolsDB.push({
    "name" : school
  });

};


// show schools
function getSchools(snapshot){

  console.log("testing getSchools");

  var regdSchool = snapshot.key; // get school object primary key
  var theRegdSchool = snapshot.val(); // get school object other data

  // show data in table
  tBodySchools.innerHTML += `
  <tr>
    <td>
      ${theRegdSchool.name}
    </td>
  </tr>
  `;

};





// use the same method for sports, as with schools
// add new sport to sportsDB
function addSport(event){

  console.log("testing addSport");

  event.preventDefault();

  var sport = inpSport.value;
  inpSport.value = "";

  sportsDB.push({
    "name" : sport
  });

};


// show sports in table
function getSports(snapshot){

  console.log("testing getSports");

  var regdSport = snapshot.key;
  var theRegdSport = snapshot.val();

  tBodySports.innerHTML += `
  <tr>
    <td>
      ${theRegdSport.name}
    </td>
  </tr>
  `;

};





// show teams
function getTeams(snapshot){

  console.log("testing getTeams");

  var regdTeam = snapshot.key;
  var theRegdTeam = snapshot.val();

  // nest a second function to get data from schoolsDB and use as foreign key
  var schoolsRef = database.ref("schools/" + theRegdTeam.school);

  schoolsRef.on("value", function(snapshotSchools){

    console.log("testing schoolsRef");

    var theSchool = snapshotSchools.val();

    // nest a third function to get data from sportsDB and use as foreign key
    var sportsRef = database.ref("sports/" + theRegdTeam.sport);

    sportsRef.on("value", function(snapshotSports){

      console.log("testing sportsRef");

      var theSport = snapshotSports.val();

      // show teams in table
      tBodyTeams.innerHTML += `
      <tr>
        <td>
          ${theRegdTeam.name}
        </td>
        <td>
          ${theSchool.name}
        </td>
        <td class="tdUppercase">
          ${theRegdTeam.class}
        </td>
        <td>
          ${theSport.name}
        </td>
      </tr>
      `;

      // show regdTeam in selTeam
      selTeam.innerHTML += `
      <option value="${regdTeam}">
        ${theRegdTeam.name}
      </option>
      `;

    });

  });

};





// use the same method for results, as with schools
// add new sport to resultsDB
function addResult(event){

  console.log("testing addResult");

  event.preventDefault();

  var chosenTeam = selTeam.value;
  var points = inpPoints.value;
  inpPoints.value = "";

  resultsDB.push({
    "team" : chosenTeam,
    "points" : points
  });

};


// show results in table
function getResults(snapshot){

  console.log("testing getResults");

  var theRegdResult = snapshot.val();

  // use a second function to get data from schoolsDB and use as foreign key
  var resultsRef = database.ref("teams/" + theRegdResult.team);

  resultsRef.on("value", function(snapshotResults){

    var theResult = snapshotResults.val();

    tBodyResults.innerHTML += `
    <tr>
      <td>${theResult.name}</td>
      <td>+ ${theRegdResult.points}</td>
    </tr>
    `;

  });

};











/* –––––––––––––––––––––––––– REGISTER FUNCTIONS –––––––––––––––––––––––––– */
// when form is submitted, run function
formSchool.onsubmit = addSchool;
formSport.onsubmit = addSport;
formResult.onsubmit = addResult;


// when database changes (when new data is added), run function
schoolsDB.on("child_added", getSchools);
sportsDB.on("child_added", getSports);
teamsDB.on("child_added", getTeams);
resultsDB.on("child_added", getResults);