import $ from "jquery";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  query,
  limitToLast,
  set,
} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVOb_5-msij8KSTAOvFkF6mF8KG5mWvRE",
  authDomain: "automatizacioni2023.firebaseapp.com",
  databaseURL: "https://automatizacioni2023-default-rtdb.firebaseio.com",
  projectId: "automatizacioni2023",
  storageBucket: "automatizacioni2023.appspot.com",
  messagingSenderId: "878834311737",
  appId: "1:878834311737:web:aad1d14a2a708c2515e3e8",
  measurementId: "G-L04G9RJSG2",
};

const firebaseConfigPropia = {
  apiKey: "AIzaSyBG84BJ6g0G7vNtHG04ALMa50jg0-a5fpY",
  authDomain: "automatizacion-57631.firebaseapp.com",
  databaseURL: "https://automatizacion-57631-default-rtdb.firebaseio.com",
  projectId: "automatizacion-57631",
  storageBucket: "automatizacion-57631.appspot.com",
  messagingSenderId: "317473957362",
  appId: "1:317473957362:web:c2e693eeacda933bc4376b"
};

$("#img1").attr("src",localStorage.getItem("image"));

// Initialize Firebase
const appPropia = initializeApp(firebaseConfigPropia,'secondary');

const databasePropia = getDatabase(appPropia);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

function lastElementOfObject(obj) {
  const keys = Object.keys(obj);
  const lastKey = keys[keys.length - 1];
  return obj[lastKey];
}

const provider = new GoogleAuthProvider();

window.addEventListener("load", () => {

  $("#google-login-btn").on("click", () => {

    const auth = getAuth();

    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        const usuario = {
          uid: user.uid,
          nombre: user.displayName,
          email: user.email,
          foto: user.photoURL,
          dia: user.metadata.lastSignInTime,
        };

        set(ref(database, "Usuarios/" + user.uid), usuario);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  });


  const todo = query(ref(database, "/"), limitToLast(100));
  
  onValue(todo, (snapshot) => {
    set(ref(databasePropia, "/"), snapshot.val());
  });

  const usuarios = query(ref(database, "/Usuarios"));
  onValue(usuarios, (snapshot) => {
    const users = snapshot.val();
    $("#app-users-list").empty();
    for (const key of Object.keys(users)) {
      $("#app-users-list").append(`
        <img width='100px' src="${users[key].foto}"/>

      `);
    }
  });

 



  google.charts.load("current", { packages: ["gauge"] });
  google.charts.load("current", { packages: ["corechart", "line"] });
  google.charts.setOnLoadCallback(drawCharts);

  function drawGauges() {

    //Valores que le paso a cada uno de los termostato

    const data = google.visualization.arrayToDataTable([
      ["Label", "Value"],
      ["", 0],
    ]);

    //Parámetros que debe tener los termostatos

    const options = {
      width: 800,
      height: 240,
      minorTicks: 5,
      max: 200,
      min: -50,
    };

    const chart = new google.visualization.Gauge(
      document.getElementById("temp-gauges")
    );

    chart.draw(data, options);

    const temperaturas1 = query(
      ref(database, "/Refrigerador/TThe3"),
      limitToLast(100)
    );
    
    onValue(temperaturas1, (snapshot) => {
      const lastTemp = lastElementOfObject(snapshot.val());
      data.setValue(0, 1, lastTemp);
      chart.draw(data, options);
    });
  }


  function drawLineChart() {
    let temps1 = {};
    let temps2 = {};
    let temps3 = {};
    let hours = {};
    let minutes = {};

    let graphNum = 1;

    const data = google.visualization.arrayToDataTable([
      ["Tiempo", "Temperatura"],
      ["0:00", 0],
      ["1:00", 0],
      ["2:00", 0],
      ["3:00", 0],
      ["4:00", 0],
      ["5:00", 0],
    ]);

    $("[data-graph-btn]").on("click", function () {
      graphNum = $(this).data("graph-btn");
      updateValuesGraph();
    });

    const options = {
      min: -100,
      max: 200,
      title: "Temperatura a travez del tiempo",
      hAxis: {
        title: "Tiempo",
        format: "HH:mm",
        titleTextStyle: { color: "orangered", fontSize: 22, bold: true },
      },
      vAxis: {
        title: "Tempertura(°C)",
        titleTextStyle: { color: "orangered", fontSize: 22, bold: true },
        viewWindowMode: "explicit",
      },
      width: 600,
      height: 400,
      legend: { position: "none" },
      titleTextStyle: { fontSize: 24 },
      pointsVisible: true,
    };

    var chart = new google.visualization.LineChart(
      document.getElementById("temp-line-charts")
    );

    chart.draw(data, options);

    function updateTimesGraph() {
      let HoursKeys = Object.keys(hours);
      let minutesKeys = Object.keys(minutes);

      if (minutesKeys.length == HoursKeys.length) {
        for (let i = 0; i < HoursKeys.length; i++) {
          data.setValue(
            i,
            0,
            `${hours[HoursKeys[i]]}:${minutes[minutesKeys[i]]}`
          );
        }
      }
      chart.draw(data, options);
    }

    function updateValuesGraph() {
      let source = [temps1, temps2, temps3][graphNum - 1];
      let keys = Object.keys(source);
      for (let i = 0; i < keys.length; i++) {
        data.setValue(i, 1, source[keys[i]]);
      }

      chart.draw(data, options);
    }

    const temperaturas1 = query(
      ref(database, "/Refrigerador/TThe3"),
      limitToLast(6)
    );
    onValue(temperaturas1, (snapshot) => {
      temps1 = snapshot.val();
      updateValuesGraph();
    });


    const minRef = query(
      ref(database, "/Refrigerador/Minutos"),
      limitToLast(6)
    );
    onValue(minRef, (snapshot) => {
      minutes = snapshot.val();
      updateTimesGraph();
    });

    const HourRef = query(ref(database, "/Refrigerador/Hora"), limitToLast(6));

    onValue(HourRef, (snapshot) => {
      hours = snapshot.val();
      updateTimesGraph();
    });
  }

  function drawCharts() {
    drawGauges();
    drawLineChart();
  }
});
