/* –––––––––––––––––––––––––– GET HTML ELEMENTS –––––––––––––––––––––––––– */
var formTeam = document.getElementById("formTeam");
var inpTeamName = document.getElementById("inpTeamName");
var selSchool = document.getElementById("selSchool");
var inpClassName = document.getElementById("inpClassName");
var selSport = document.getElementById("selSport");

var tBodyTeams = document.getElementById("tBodyTeams");


/* –––––––––––––––––––––––––– GET DATABASES –––––––––––––––––––––––––– */
var database = firebase.database();
var schoolsDB = database.ref("schools");
var sportsDB = database.ref("sports");
var teamsDB = database.ref("teams");









/* –––––––––––––––––––––––––– PUSH AND GET DATA –––––––––––––––––––––––––– */
// show schools
function getSchools(snapshot){

  console.log("testing getSchools");

  var regdSchool = snapshot.key; // get school object primary key
  var theRegdSchool = snapshot.val(); // get school object other data

  // show schools in selSchool
  selSchool.innerHTML += `
  <option value="${regdSchool}">
    ${theRegdSchool.name}
  </option>
  `;

};





// show sports
function getSports(snapshot) {
  console.log("testing getSports");

  var regdSport = snapshot.key;
  var theRegdSport = snapshot.val();

  selSport.innerHTML += `
  <option value="${regdSport}">
  ${theRegdSport.name}
  </option>
  `;
};





function addTeam(event){

  console.log("testing addTeam");

  event.preventDefault();

  var team = inpTeamName.value;
  var chosenSchool = selSchool.value;
  var className = inpClassName.value;
  var chosenSport = selSport.value;

  inpTeamName.value = "";
  inpClassName.value = "";

  teamsDB.push({
    "name" : team,
    "school" : chosenSchool,
    "class" : className,
    "sport" : chosenSport
  });

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

    var regdTeamSchool = snapshot.key;
    var theSchool = snapshotSchools.val();

    // nest a third function to get data from sportsDB and use as foreign key
    var sportsRef = database.ref("sports/" + theRegdTeam.sport);

    sportsRef.on("value", function(snapshotSports){

      console.log("testing sportsRef");

      var regdTeamSport = snapshot.key;
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

    });

  });

};










/* –––––––––––––––––––––––––– REGISTER FUNCTIONS –––––––––––––––––––––––––– */
// when form is submitted, run function
formTeam.onsubmit = addTeam;


// when database changes (when new data is added), run function
schoolsDB.on("child_added", getSchools);
sportsDB.on("child_added", getSports);
teamsDB.on("child_added", getTeams);
