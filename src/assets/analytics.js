const getDate = new Date();
const year = getDate.getFullYear();
const month = (getDate.getMonth() + 1).toString().padStart(2, "0");
const day = getDate.getDate();
const date = formatDate(getDate);
const hh = getDate.getHours();
const mm = getDate.getMinutes();
const ss = getDate.getSeconds();
const times = `${hh.toLocaleString()}:${mm.toLocaleString()}:${ss.toLocaleString()}`;

const socket = io("https://cynta-backend.onrender.com/");

const browserNameMapping = {
  Firefox: "Mozilla Firefox",
  "Edg/": "Microsoft Edge",
  Chrome: "Google Chrome",
  Safari: "Apple Safari",
  Opera: "Opera",
  MSIE: "Internet Explorer",
  "Trident/": "Internet Explorer",
};
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const titleElements = document.querySelectorAll("title");
const clientName = titleElements[0].innerHTML;
// HTML template for cookie prompt
const htmlTemplate = `
<div id="cookiePopup" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
  <div class="wrapper" style="background: #fff; position: fixed; bottom: 20px; left: 50px; max-width: 500px; border-radius: 15px; text-align: center; border: 1px solid #493179; padding: 25px; overflow: hidden; box-shadow: 0 0 18px rgba(0, 0, 0, 0.13);">
    <img src="../../assets/img/cookie.png" alt="" style="max-width: 90px;">
    <div class="content" style="margin-top: 10px;">
      <header style="font-size: 25px; font-weight: 600;">Cookies</header>
      <h1 style="font-size: 25px; font-weight: 600;">GDPR Compliance Notice</h1>
      <h5>What data do we collect?</h5>
      <ul style="list-style-type: disc; text-align: left;">
      <li>We collect personal information such as your name, email address, and location when you sign up for our service or interact with our platform.</li>
      <li>We also gather data on your usage patterns, preferences, and interactions with our website/application/service to improve your experience and tailor our offerings to your needs.</li>
    </ul>
      <div class="buttons" style="display: flex; justify-content: center; align-items: center;">
        <button class="item cancel" onclick="onBlock()" style="padding: 10px 20px; margin: 0 5px; border: none; outline: none; font-size: 16px; font-weight: 500; border-radius: 5px; cursor: pointer; background: #eee; color: #333;">Cancel</button>
        <button class="item accept" onclick="onAccept()" style="padding: 10px 20px; margin: 0 5px; border: none; outline: none; font-size: 16px; font-weight: 500; border-radius: 5px; cursor: pointer; background: #493179; color: #fff;">Accept</button>
      </div>
    </div>
  </div>
</div>
`;

let userDetail = {};
let pageName = "";
let newPageName = "";
let isPageChanged = false;
let id;
let time;
let serverUpdateTime;
let isResponseToDB = false;
let ipAddress;
let ls = {};
let clickCounts = {};

let lastLocation = null;
let map;
let userMarker;
let trackingVendor = null;
let currentRoute = null;
let vendorMarkers = [];

document.addEventListener("DOMContentLoaded", function () {
  const vendorPopup = document.createElement("div");
  vendorPopup.id = "vendor-feature-container";
  vendorPopup.innerHTML = `
    <div
      id="vendor-feature-container"
      style="font-family: 'Manrope', sans-serif; color: black"
    >
      <div
        id="find-vendor"
        style="position: fixed; bottom: 10px; right: 15px; cursor: pointer"
        onclick="openVendorFeature()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="46"
          height="46"
          viewBox="0 0 46 46"
        >
          <g
            id="Group_22749"
            data-name="Group 22749"
            transform="translate(-2068 -281)"
          >
            <circle
              id="Ellipse_243"
              data-name="Ellipse 243"
              cx="23"
              cy="23"
              r="23"
              transform="translate(2068 281)"
              fill="#2078ff"
            />
            <path
              id="Path_16673"
              data-name="Path 16673"
              d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,1,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8,8,8,0,0,1-8,8Z"
              transform="translate(2079.033 292.032)"
              fill="#f0f5ff"
            />
            <path
              id="Path_16676"
              data-name="Path 16676"
              d="M118.851,6.419a.621.621,0,0,0,.533-.3c.8-1.312,1.758-3.042,1.758-3.829a2.291,2.291,0,0,0-4.583,0c0,.787.956,2.517,1.758,3.829A.621.621,0,0,0,118.851,6.419Zm-.921-4.285a.921.921,0,1,1,.921.921A.922.922,0,0,1,117.93,2.134Z"
              transform="translate(1969.857 298.581)"
              fill="#f0f5ff"
            />
          </g>
        </svg>
      </div>

      <div
        id="vendor-popup"
        style="
          width: 250px;
          max-height: 200px;
          color: #000000;
          background-color: white;
          border-radius: 12px;
          box-shadow: 3px 3px 6px #0000001f;
          border: 1px solid #ddd;
          position: fixed;
          bottom: 10px;
          right: 10px;
          display: none;
          flex-direction: column;
          align-items: center;
          padding: 15px;
        "
      >
        <p
          style="font-size: 14px; font-weight: bold; margin: 0px; padding: 0px"
        >
          Would you like to search near my vendor?
        </p>
        <div
          class="btn-section"
          style="
            display: flex;
            justify-content: space-evenly;
            width: 100%;
            margin-top: 10px;
            gap: 20px;
            font-size: 12px;
          "
        >
          <button
            style="
              border: none;
              border-radius: 20px;
              width: 120px;
              height: 25px;
              cursor: pointer;
              background-color: #5054dd;
              color: white;
            "
            onclick="openForm()"
          >
            Yes
          </button>
          <button
            style="
              border: none;
              border-radius: 20px;
              width: 120px;
              height: 25px;
              cursor: pointer;
              background-color: #f5f5f5;
            "
            onclick="closePopup()"
          >
            No
          </button>
        </div>
      </div>

      <div
        id="usertype-selection-container"
        style="
          display: none;
          flex-direction: column;
          width: 250px;
          height: 110px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 3px 3px 6px #0000001f;
          border: 1px solid #ddd;
          position: fixed;
          bottom: 10px;
          right: 10px;
          padding: 15px;
          justify-content: space-between;
        "
      >
        <p
          style="font-size: 14px; font-weight: bold; margin: 0px; padding: 0px"
        >
          Select your user category
        </p>
        <div class="radio-btn-container" style="display: flex; gap: 70px">
          <div class="usertype-radio-btn" style="display: flex; gap: 3px">
            <input
              type="radio"
              id="customer"
              name="usertype"
              value="customer"
              required
              style="width: 12px; height: 16px"
            />
            <label for="customer" style="font-weight: 500; font-size: 12px"
              >Customer</label
            >
          </div>
          <div class="usertype-radio-btn" style="display: flex; gap: 3px">
            <input
              type="radio"
              id="vendor"
              name="usertype"
              value="vendor"
              required
              style="width: 12px; height: 16px"
            />
            <label for="vendor" style="font-weight: 500; font-size: 12px"
              >Vendor</label
            >
          </div>
        </div>

        <div
          class="btn-section"
          style="
            display: flex;
            justify-content: space-between;
            width: 100%;
            font-size: 12px;
            gap: 20px;
          "
        >
          <button
            style="
              border: none;
              border-radius: 20px;
              width: 120px;
              height: 25px;
              cursor: pointer;
              background-color: #5054dd;
              color: white;
            "
            onclick="submitUserType()"
          >
            Submit
          </button>
          <button
            style="
              border: none;
              border-radius: 20px;
              width: 120px;
              height: 25px;
              cursor: pointer;
              background-color: #f5f5f5;
            "
            onclick="closeUserType()"
          >
            Cancel
          </button>
        </div>
      </div>

      <div
        id="customer-form-container"
        style="
          display: none;
          position: fixed;
          bottom: 10px;
          right: 10px;
          background-color: white;
          border-radius: 15px;
          box-shadow: 3px 3px 6px #0000001f;
          border: 1px solid #ddd;
          max-width: 200px;
          max-height: 400px;
          padding: 15px;
          font-size: 14px;
        "
      >
        <button
          class="form-cancel-btn"
          style="
            position: absolute;
            top: 6px;
            right: 6px;
            border-radius: 100%;
            height: 25px;
            width: 25px;
            cursor: pointer;
            border: 1px solid #d4d4d4;
            background-color: white;
          "
          onclick="closeForm('customer')"
        >
          x
        </button>
        <p
          class="form-title"
          style="margin: 0px; font-weight: bold; font-size: 14px; padding: 0px"
        >
          Enter customer details
        </p>
        <form
          style="
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 12px;
            font-weight: 400;
            margin-top: 10px;
          "
          onsubmit="submitUserDetails(event)"
        >
          <div>
            <label for="username" style="font-size: 12px"
              >Enter your Name</label
            >
            <input
              type="text"
              id="username"
              name="username"
              style="
                border-radius: 6px;
                border: 1px solid #dbdbdb;
                height: 20px;
                margin-top: 2px;
                width: 100%;
                padding-left: 5px;
              "
              onfocus="this.style.outline = '1px solid #5054DD'"
              onblur="this.style.outline = 'none';"
              required
            />
          </div>
          <div>
            <label for="useremail">Enter your Email</label>
            <input
              type="email"
              id="useremail"
              name="useremail"
              style="
                border-radius: 6px;
                border: 1px solid #dbdbdb;
                height: 20px;
                margin-top: 2px;
                width: 100%;
                padding-left: 5px;
              "
              onfocus="this.style.outline = '1px solid #5054DD'"
              onblur="this.style.outline = 'none';"
              required
            />
          </div>
          <div>
            <label for="choose-vendor">Select Company Type</label>
            <select
              name="choose-vendor"
              id="choose-vendor"
              style="
                border-radius: 6px;
                border: 1px solid #dbdbdb;
                height: 25px;
                margin-top: 2px;
                width: 100%;
                color: #9c9c9c;
                padding-left: 5px;
              "
              onfocus="this.style.outline = '1px solid #5054DD'"
              onblur="this.style.outline = 'none';"
              required
            >
              <option value="none" selected disabled>Company Type</option>
              <option value="bank">Bank</option>
              <option value="insurance">Insurance</option>
            </select>
          </div>
          <div
            class="btn-section"
            style="
              display: flex;
              gap: 20px;
              justify-content: space-evenly;
              width: 100%;
              margin-top: 5px;
            "
          >
            <button
              style="
                border: none;
                border-radius: 20px;
                width: 120px;
                height: 25px;
                cursor: pointer;
                background-color: #5054dd;
                color: white;
                font-size: 12px;
              "
              type="submit"
            >
              Submit
            </button>
            <button
              style="
                border: none;
                border-radius: 20px;
                width: 120px;
                height: 25px;
                cursor: pointer;
                background-color: #f5f5f5;
                font-size: 12px;
              "
              onclick="resetForm('customer')"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div
        id="vendor-form-container"
        style="
          display: none;
          position: fixed;
          bottom: 10px;
          right: 10px;
          background-color: white;
          border-radius: 15px;
          box-shadow: 3px 3px 6px #0000001f;
          border: 1px solid #ddd;
          max-width: 200px;
          max-height: 500px;
          padding: 15px;
          font-size: 14px;
        "
      >
        <button
          class="form-cancel-btn"
          style="
            position: absolute;
            top: 6px;
            right: 6px;
            border-radius: 100%;
            height: 25px;
            width: 25px;
            cursor: pointer;
            border: 1px solid #d4d4d4;
            background-color: white;
          "
          onclick="closeForm('vendor')"
        >
          x
        </button>
        <p
          class="form-title"
          style="margin: 0px; font-weight: bold; font-size: 14px; padding: 0px"
        >
          Enter vendor details
        </p>
        <form
          style="
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 12px;
            font-weight: 400;
            margin-top: 10px;
          "
          onsubmit="submitVendorDetails(event)"
        >
          <div>
            <label for="vendorname">Enter Your Name</label>
            <input
              type="text"
              id="vendorname"
              name="vendorname"
              style="
                border-radius: 6px;
                border: 1px solid #dbdbdb;
                height: 20px;
                margin-top: 2px;
                width: 100%;
                padding-left: 5px;
              "
              onfocus="this.style.outline = '1px solid #5054DD'"
              onblur="this.style.outline = 'none';"
              required
            />
          </div>
          <div>
            <label for="vendoremail">Enter Your Email</label>
            <input
              type="email"
              id="vendoremail"
              name="vendoremail"
              style="
                border-radius: 6px;
                border: 1px solid #dbdbdb;
                height: 20px;
                margin-top: 2px;
                width: 100%;
                padding-left: 5px;
              "
              onfocus="this.style.outline = '1px solid #5054DD'"
              onblur="this.style.outline = 'none';"
              required
            />
          </div>
          <div>
            <label for="choose-company-type">Select Company Type</label>
            <select
              name="choose-company-type"
              id="choose-company-type"
              style="
                border-radius: 6px;
                border: 1px solid #dbdbdb;
                height: 25px;
                margin-top: 2px;
                width: 100%;
                color: #9c9c9c;
                padding-left: 5px;
              "
              onfocus="this.style.outline = '1px solid #5054DD'"
              onblur="this.style.outline = 'none';"
              required
            >
              <option value="none" selected disabled>Company Type</option>
              <option value="bank">Bank</option>
              <option value="insurance">Insurance</option>
            </select>
          </div>
          <div>
            <label for="companyname">Enter Your Company Name</label>
            <input
              type="text"
              id="companyname"
              name="companyname"
              style="
                border-radius: 6px;
                border: 1px solid #dbdbdb;
                height: 20px;
                margin-top: 2px;
                width: 100%;
                padding-left: 5px;
              "
              onfocus="this.style.outline = '1px solid #5054DD'"
              onblur="this.style.outline = 'none';"
              required
            />
          </div>
          <div>
            <label for="vendorcontact">Enter Your Contact Number</label>
            <input
              type="tel"
              id="vendorcontact"
              name="vendorcontact"
              style="
                border-radius: 6px;
                border: 1px solid #dbdbdb;
                height: 20px;
                margin-top: 2px;
                width: 100%;
                padding-left: 5px;
              "
              onfocus="this.style.outline = '1px solid #5054DD'"
              onblur="this.style.outline = 'none';"
              required
            />
          </div>
          <div>
            <label for="companyaddress">Company Address:</label>
            <textarea
              name="companyaddress"
              id="companyaddress"
              style="
                border-radius: 6px;
                border: 1px solid #dbdbdb;
                height: 50px;
                margin-top: 2px;
                width: 100%;
                padding-left: 5px;
              "
              onfocus="this.style.outline = '1px solid #5054DD'"
              onblur="this.style.outline = 'none';"
            ></textarea>
          </div>
          <div
            class="btn-section"
            style="
              display: flex;
              gap: 20px;
              justify-content: space-between;
              width: 100%;
            "
          >
            <button
              style="
                border: none;
                border-radius: 20px;
                width: 120px;
                height: 25px;
                cursor: pointer;
                background-color: #5054dd;
                color: white;
                font-size: 12px;
              "
              type="submit"
            >
              Submit
            </button>
            <button
              style="
                border: none;
                border-radius: 20px;
                width: 120px;
                height: 25px;
                cursor: pointer;
                background-color: #f5f5f5;
                font-size: 12px;
              "
              onclick="resetForm('vendor')"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

       <div
      id="map-view"
      style="position: fixed; left: 10px; bottom: 10px; display: none"
    >
      <div id="map" style="height: 250px; width: 300px"></div>
    </div>
    </div>
  `;
  document.body.appendChild(vendorPopup);
});

let customerWatcher = null;
let vendorWatcher = null;

socket.on("vendorDetails", (data) => {
  console.log(data);
  clearVendorMarkers();
  resetTracking();

  if (Array.isArray(data)) {
    data.forEach((vendor) => addVendorMarker(vendor));
  } else if (data.location) {
    addVendorMarker(data);
  } else {
    alert("Invalid vendor data");
    console.log(data);
  }
});

function openVendorFeature() {
  const popup = document.getElementById("vendor-popup");
  popup.style.display = "flex";
}

function openForm() {
  closePopup();

  const usertypeContainer = document.getElementById(
    "usertype-selection-container"
  );
  if (usertypeContainer) {
    usertypeContainer.style.display = "flex";
  } else {
    console.error(
      "Element with id 'usertype-selection-container' not found in the DOM."
    );
  }
}

function closePopup() {
  let popupbox = document.getElementById("vendor-popup");
  popupbox.style.display = "none";
}

function closeVendorNotification() {
  let vendorPopup = document.getElementById("vendorDetailsPopup");
  vendorPopup.style.display = "none";
}

function closeUserType() {
  let userType = document.getElementById("usertype-selection-container");
  userType.style.display = "none";
}

function submitUserType() {
  const selectedCategory = document.querySelector(
    'input[name="usertype"]:checked'
  );

  if (selectedCategory.value === "customer") {
    let customerForm = document.getElementById("customer-form-container");
    customerForm.style.display = "block";
    closeUserType();
  } else if (selectedCategory.value === "vendor") {
    let vendorForm = document.getElementById("vendor-form-container");
    vendorForm.style.display = "block";
    closeUserType();
  }
}

function closeForm(usercategory) {
  if (usercategory === "customer") {
    let customerFormClose = document.getElementById("customer-form-container");
    customerFormClose.style.display = "none";
  } else if (usercategory === "vendor") {
    let vendorFormClose = document.getElementById("vendor-form-container");
    vendorFormClose.style.display = "none";
  }
}

function initializeMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        map = new google.maps.Map(document.getElementById("map"), {
          center: { lat, lng },
          zoom: 15,
          streetViewControl: false,
          styles: [
            {
              featureType: "poi.business",
              elementType: "labels",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "poi.park",
              elementType: "labels",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "poi.place_of_worship",
              elementType: "labels",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "poi.school",
              elementType: "labels",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "road",
              elementType: "labels",
              stylers: [
                {
                  visibility: "on",
                },
              ],
            },
            {
              featureType: "administrative",
              elementType: "labels",
              stylers: [
                {
                  visibility: "on",
                },
              ],
            },
            {
              featureType: "landscape",
              elementType: "labels",
              stylers: [
                {
                  visibility: "on",
                },
              ],
            },
            {
              featureType: "administrative.country",
              elementType: "labels",
              stylers: [
                {
                  visibility: "on",
                },
              ],
            },
            {
              featureType: "administrative.province",
              elementType: "labels",
              stylers: [
                {
                  visibility: "on",
                },
              ],
            },
            {
              featureType: "administrative.locality",
              elementType: "labels",
              stylers: [
                {
                  visibility: "on",
                },
              ],
            },
          ],
        });

        userMarker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title: "Your Location",
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="24.422" height="29.309" viewBox="0 0 24.422 29.309">
  <g id="Group_22757" data-name="Group 22757" transform="translate(-2092 -169)">
    <circle id="Ellipse_240" data-name="Ellipse 240" cx="8.5" cy="8.5" r="8.5" transform="translate(2096.298 175)" fill="#ee374d"/>
    <path id="map-marker-check" d="M22.857,3.586A12.218,12.218,0,1,0,5.587,20.875l8.63,8.44,8.64-8.45a12.234,12.234,0,0,0,0-17.279ZM14.1,16.4a2.421,2.421,0,0,1-1.719.709,2.445,2.445,0,0,1-1.73-.715L7.254,13.1l1.7-1.756,3.413,3.308,7.1-6.966,1.715,1.741L14.1,16.4Z" transform="translate(2089.993 168.994)" fill="#ee374d"/>
    <g id="user_1_" data-name="user (1)" transform="translate(2036.268 175)">
      <circle id="Ellipse_245" data-name="Ellipse 245" cx="2.656" cy="2.656" r="2.656" transform="translate(65.503)" fill="#f0f5ff"/>
      <path id="Path_16679" data-name="Path 16679" d="M68.19,298.667a4.194,4.194,0,0,1,4.19,4.19.466.466,0,0,1-.466.466H64.466a.466.466,0,0,1-.466-.466A4.194,4.194,0,0,1,68.19,298.667Z" transform="translate(-0.268 -292.15)" fill="#f0f5ff"/>
    </g>
  </g>
</svg>
`
              ),
            scaledSize: new google.maps.Size(50, 50),
          },
        });

        lastLocation = { latitude: lat, longitude: lng };
        updateMapLocation(lat, lng);
        startTracking();
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve location.");
      },
      { enableHighAccuracy: true }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function updateMapLocation(lat, lng) {
  if (userMarker) {
    userMarker.setPosition(new google.maps.LatLng(lat, lng));
    map.panTo(new google.maps.LatLng(lat, lng));
  }
}

function drawRoute(startLocation, endLocation) {
  if (!startLocation || !endLocation) {
    console.error("Invalid start or end location for route.");
    return;
  }

  if (currentRoute) {
    currentRoute.setMap(null);
  }

  const start = new google.maps.LatLng(
    startLocation.latitude,
    startLocation.longitude
  );
  const end = new google.maps.LatLng(
    endLocation.latitude,
    endLocation.longitude
  );

  const directionsService = new google.maps.DirectionsService();
  currentRoute = new google.maps.DirectionsRenderer({
    map: map,
    polylineOptions: {
      strokeColor: "#ff0000",
      strokeWeight: 4,
    },
    suppressMarkers: true,
  });

  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        currentRoute.setDirections(result);
      } else {
        console.error("Directions request failed:", status);
      }
    }
  );
}

function startVendorTracking() {
  if (navigator.geolocation) {
    vendorWatcher = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const vendorDetails = {
          name: document.getElementById("vendorname").value,
          email: document.getElementById("vendoremail").value,
          location: { latitude: lat, longitude: lng },
        };

        console.log("location", lat, lng);

        socket.emit("vendorDetails", vendorDetails);
      },
      (error) => {
        console.error("Error tracking vendor location:", error);
      },
      { enableHighAccuracy: true }
    );
  }
}

function getDistance(loc1, loc2) {
  const R = 6371e3;
  const lat1 = (loc1.latitude * Math.PI) / 180;
  const lat2 = (loc2.latitude * Math.PI) / 180;
  const deltaLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const deltaLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function addVendorMarker(vendor) {
  console.log('methods', vendor)
  if (!vendor || !vendor.location) return;

  const position = new google.maps.LatLng(
    vendor.location.latitude,
    vendor.location.longitude
  );

  const vendorMarker = new google.maps.Marker({
    position,
    map,
    title: vendor.name,
    icon: {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="24.422" height="29.309" viewBox="0 0 24.422 29.309">
  <g id="Group_22745" data-name="Group 22745" transform="translate(-2047 -169)">
    <path id="map-marker-check" d="M22.857,3.586A12.218,12.218,0,1,0,5.587,20.875l8.63,8.44,8.64-8.45a12.234,12.234,0,0,0,0-17.279ZM14.1,16.4a2.421,2.421,0,0,1-1.719.709,2.445,2.445,0,0,1-1.73-.715L7.254,13.1l1.7-1.756,3.413,3.308,7.1-6.966,1.715,1.741L14.1,16.4Z" transform="translate(2044.993 168.994)" fill="#2078ff"/>
    <circle id="Ellipse_239" data-name="Ellipse 239" cx="8.5" cy="8.5" r="8.5" transform="translate(2051 175)" fill="#2078ff"/>
    <path id="seller" d="M9.166,7.3v.155a.9.9,0,0,1-.865.931H8.012a.9.9,0,0,1-.865-.931v0h0a.9.9,0,0,1-.865.931H5.994a.888.888,0,0,1-.855-.789.532.532,0,0,1,.044-.274l.165-.4A1.4,1.4,0,0,1,6.64,6.054H9.672a1.4,1.4,0,0,1,1.291.864l.165.4a.527.527,0,0,1,.044.274.888.888,0,0,1-.855.789h-.288a.9.9,0,0,1-.865-.931h0M6.519,2.794A2.794,2.794,0,1,0,3.726,5.589,2.8,2.8,0,0,0,6.519,2.794Zm3.8,6.52h-.288a1.733,1.733,0,0,1-.864-.231,1.739,1.739,0,0,1-.865.231H8.012a1.737,1.737,0,0,1-.865-.231,1.736,1.736,0,0,1-.864.231H5.994a1.72,1.72,0,0,1-.4-.053V9.78a1.4,1.4,0,0,0,1.4,1.4H9.321a1.4,1.4,0,0,0,1.4-1.4V9.262a1.7,1.7,0,0,1-.4.053ZM4.663,9.78V8.691a1.871,1.871,0,0,1-.447-.965,1.446,1.446,0,0,1,.1-.759L4.474,6.6A3.728,3.728,0,0,0,0,10.246v.466a.466.466,0,0,0,.466.466H5.141a2.3,2.3,0,0,1-.478-1.4Z" transform="translate(2054 175)" fill="#f0f5ff"/>
  </g>
</svg>

`
        ),
      scaledSize: new google.maps.Size(50, 50),
    },
  });

  vendorMarkers.push(vendorMarker);

  const infoWindowContent = `<div>
      <h3>
        ${vendor.companyName} (${vendor.companyType})
      </h3>
      <p>
        <b>Name:</b> ${vendor.name}
      </p>
      <p>
        <b>Contact:</b> ${vendor.contact}
      </p>
      <p>
        <b>Email:</b> ${vendor.email}
      </p>
      <p>
        <b>Address:</b> ${vendor.address}
      </p>
    </div>`;
  const infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent,
  });

  vendorMarker.addListener("click", () => {
    drawRoute(lastLocation, vendor.location);
    trackingVendor = vendor;
  });

  vendorMarker.addListener("mouseover", () => {
    infoWindow.open(map, vendorMarker);
  });

  vendorMarker.addListener("mouseout", () => {
    infoWindow.close();
  });
}

function clearVendorMarkers() {
  vendorMarkers.forEach((marker) => marker.setMap(null));
  vendorMarkers = [];
}

function resetTracking() {
  trackingVendor = null;
  if (currentRoute) {
    currentRoute.setMap(null);
  }
}

function startTracking() {
  if (navigator.geolocation) {
    customerWatcher = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (
          !lastLocation ||
          getDistance(lastLocation, { latitude: lat, longitude: lng }) > 5
        ) {
          lastLocation = { latitude: lat, longitude: lng };
          updateMapLocation(lat, lng);

          socket.emit("customerData", {
            name: document.getElementById("username").value,
            email: document.getElementById("useremail").value,
            vendorType: document.getElementById("choose-vendor").value,
            location: lastLocation,
          });

             if (trackingVendor) {
            drawRoute(lastLocation, trackingVendor.location);
          }
        }
      },
      (error) => {
        console.error("Error tracking location:", error);
      },
      { enableHighAccuracy: true }
    );
  }
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (data) => {
        const userLocation = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
        };
        resolve(userLocation);
      },
      (error) => {
        console.error("Error getting location:", error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

function submitUserDetails(e) {
  e.preventDefault();

  const name = document.getElementById("username").value;
  const email = document.getElementById("useremail").value;
  const vendorType = document.getElementById("choose-vendor").value;

  getUserLocation()
    .then((location) => {
      const userDetails = {
        name,
        email,
        vendorType,
        location: location,
      };
      socket.emit("customerData", userDetails);
      const customerForm = document.getElementById("customer-form-container");
      customerForm.style.display = "none";

      document.getElementById("map-view").style.display = "block";
      initializeMap();
    })
    .catch((error) => { 
      console.log("Failed to retrieve location", error), 
      alert(error.message)
    });
}

function resetForm(data) {
  if (data === "customer") {
    document.getElementById("username").value = "";
    document.getElementById("useremail").value = "";
    document.getElementById("choose-vendor").value = "none";
  } else if (data === "vendor") {
    document.getElementById("vendorname").value = "";
    document.getElementById("vendoremail").value = "";
    document.getElementById("choose-vendor").value = "none";
    document.getElementById("companyname").value = "";
    document.getElementById("vendorcontact").value = "";
    document.getElementById("companyaddress").value = "";
  }
}

function submitVendorDetails(e) {
  e.preventDefault();

  const name = document.getElementById("vendorname").value;
  const email = document.getElementById("vendoremail").value;
  const companyType = document.getElementById("choose-company-type").value;
  const companyName = document.getElementById("companyname").value;
  const contact = document.getElementById("vendorcontact").value;
  const address = document.getElementById("companyaddress").value;

  console.log(
    "vendor",
    name,
    email,
    companyType,
    companyName,
    contact,
    address
  );

  getUserLocation()
    .then((location) => {
      const vendorDetails = {
        name,
        email,
        companyType,
        companyName,
        contact,
        address,
        location: location,
      };
      console.log("vend", vendorDetails);
      socket.emit("vendorDetails", vendorDetails);
      startVendorTracking();
      const vendorForm = document.getElementById("vendor-form-container");
      vendorForm.style.display = "none";
    })
    .catch((error) => {
      console.log("Failed to retrieve location", error),
      alert(error.message)
    });
}

socket.on("connect", () => {
  console.log("Connected to the server");
});

socket.on("welcome", (data) => {
  console.log("Received welcome message:", data);
});

socket.on("receive_message", (data) => {
  displayProductNotification(data);
});

function displayProductNotification(data) {
  let notificationContainer = document.getElementById("notification-container");

  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.id = "notification-container";
    document.body.appendChild(notificationContainer);
  }

  notificationContainer.innerHTML = data;
}

function closeNotification(element) {
  element.parentElement.style.display = "none";
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const generateString = (length) => {
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const userAgent = navigator.userAgent;
const browserName =
  Object.keys(browserNameMapping).find((key) => userAgent.includes(key)) ||
  "Unknown Browser";

function storeUserName(value) {
  sessionStorage.setItem("usernames", JSON.stringify(value));
}

if (!getCookie("deviceType")) {
  let deviceTypeInfo = detectDeviceType();
  setCookie("deviceType", deviceTypeInfo, 24);
}

//to get ip adress
fetch("https://api.ipify.org?format=json")
  .then((response) => response.json())
  .then((data) => {
    console.log(`IPdata${data.ip}`);
    ipAddress = data.ip;
    const deviceType = getCookie("deviceType");
    console.log("Device Type:", deviceType);

    userDetail = {
      userInfo: [
        {
          ip: ipAddress,
          userName: generateString(5),
          browserName: browserName,
          dates: date,
          time: times,
          deviceType: deviceType,
          clientName: clientName,
        },
      ],
    };

    try {
      const userNameKey = JSON.parse(sessionStorage.usernames);
      const ipCheck = userNameKey.userInfo[0].ip;
    } catch {
      storeUserName(userDetail);
    }

    const userNameKey = JSON.parse(sessionStorage.usernames);
    const ipCheck = userNameKey.userInfo[0].ip;

    if (ipAddress != ipCheck) {
      storeUserName(userDetail);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Event handler functions
let isCookieCancel = false;
function onAccept() {
  this.getUserRegion();
  closeCookiePopup();
}

function onBlock() {
  closeCookiePopup();
  isCookieCancel = false;
  if (isCookieCancel) {
    sendUserInfoToConfig(userDetail.userInfo[0]);
  }
}

// Function to close the cookie popup
function closeCookiePopup() {
  const cookiePopup = document.getElementById("cookiePopup");

  if (cookiePopup) {
    cookiePopup.style.display = "none";
  }
}

// Function to set cookie with expiry time
function setCookie(name, value, hours) {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000); // Convert hours to milliseconds
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getUserRegion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

        let userType;

        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            const country = data.address.country;
            const city = data.address.county;
            const storedUserData = sessionStorage.getItem("usernames");

            for (let i = 0; i < sessionStorage.length; i++) {
              const key = sessionStorage.key(i);
            }

            if (storedUserData) {
              userType = "Authenticated";
            } else {
              userType = "Anonymous";
            }

            const deviceType = getCookie("deviceType");
            console.log("Device Type:", deviceType);
            const userInfo = {
              ip: ipAddress,
              userName: generateString(5),
              userType: userType,
              browserName: browserName,
              dates: date,
              time: times,
              clientName: clientName,
              deviceType: deviceType,
            };
            const locationInfo = {
              clientName: clientName,
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              cityName: city.toString(),
              country: country.toString(),
            };
            const deviceTypeInfo = {
              clientName: clientName,
              DeviceName: deviceType,
            };

            sendUserInfoToConfig(userInfo, locationInfo, deviceTypeInfo);
          });

        setCookie("cookieAccepted", "true", 24);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

async function sendUserInfoToConfig(userInfo, locationInfo, deviceTypeInfo) {
  try {
    const response = await fetch("https://webanalyticals.onrender.com/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInfo: userInfo,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Error sending userInfo to config API: ${response.status}`
      );
    }

    const configData = await response.json();
    console.log("Config Data:", configData);
    id = configData._id;
    time = configData.serverUpdateTime;
    setCookie("serverUpdateTime", time, 30); // Set a cookie named "userId" with the extracted id that expires in 30 days
    setCookie("userId", id, 30); // Set a cookie named "userId" with the extracted id that expires in 30 days
    locationInfo._id = id;
    deviceTypeInfo._id = id;
    sendUserLocation(locationInfo);
    sendDeviceInfo(deviceTypeInfo);
  } catch (error) {
    console.error("Error sending userInfo to config API:", error);
  }
}

async function sendUserLocation(loctioninfo) {
  try {
    const response = await fetch(
      "https://webanalyticals.onrender.com/saveMapData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loctioninfo),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error sending loctioninfo to saveMapData API: ${response.status}`
      );
    }
    const locationData = await response.json();
    console.log("Location Data:", locationData);
  } catch (error) {
    console.error("Error sending Location Information to Location API:", error);
  }
}

async function sendDeviceInfo(deviceTypeInfo) {
  try {
    const response = await fetch(
      "https://webanalyticals.onrender.com/saveDeviceData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceTypeInfo),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error sending loctioninfo to saveMapData API: ${response.status}`
      );
    }
    const deviceData = await response.json();
    console.log("Device Data:", deviceData);
  } catch (error) {
    console.error("Error sending Device Information to Device API:", error);
  }
}

function detectDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/ipad|tablet|playbook|silk/i.test(userAgent)) {
    return "tablet";
  } else if (
    /mobile|iphone|ipod|blackberry|opera mini|iemobile|windows phone|trident|opera mobi|mobilesafari|htc|nokia|symbian|samsung|lg|mot/i.test(
      userAgent
    )
  ) {
    return "mobile";
  } else {
    return "pc";
  }
}
const deviceType = getCookie("deviceType");
console.log("Device Type:", deviceType);

function getCookie(cookieName) {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    if (cookie.indexOf(cookieName + "=") === 0) {
      return cookie.substring(cookieName.length + 1);
    }
  }

  return null;
}

// Function to inject HTML into the DOM
function injectHTML(html) {
  const sessionDetails = getCookie("cookieAccepted");

  if (!sessionDetails) {
    const container = document.createElement("div");
    container.innerHTML = htmlTemplate.trim();
    document.body.appendChild(container.firstChild);
  }
}

// Inject HTML template into the DOM after DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  injectHTML(htmlTemplate);
});

function storeUserEvent(value) {
  sessionStorage.setItem("userevents", JSON.stringify(value));
  isResponseToDB = true;
}

function determineCurrentScreen() {
  const currentURL = window.location.href;
  pageName = currentURL.substring(currentURL.lastIndexOf("/") + 1);
}

document.addEventListener("DOMContentLoaded", () => {
  determineCurrentScreen();
});

function changedPageName(isPageChangedtoOtherScreen) {
  if (isPageChangedtoOtherScreen) {
    pageName = newPageName;
  }
  return pageName;
}

(function () {
  let captureObject = {};
  let clickCounts = {};
  let responseToDB;
  let requesteDataToDB;

  function updateClickCount(tagId, tagType) {
    if (!clickCounts[tagId]) {
      clickCounts[tagId] = 1;
    } else {
      clickCounts[tagId]++;
    }

    const clickCountDisplay = document.getElementById(
      `${tagType}${tagId}_click_count`
    );

    if (clickCountDisplay) {
      clickCountDisplay.textContent = clickCounts[tagId];
    }

    if (!captureObject[pageName]) {
      captureObject[pageName] = {};
    }

    userDetail.userEvents = [];
    captureObject[pageName][`${tagType}${tagId}`] = clickCounts[tagId];
    userDetail.userEvents = [{ ...captureObject }];
    console.log("User Clicked Events: " + JSON.stringify(userDetail));
    captureObject = {};
    clickCounts = {};

    let oldObject;
    let userEventDetail = sessionStorage.getItem("userevents");
    let newObject = JSON.parse(JSON.stringify(userDetail));
    let currentUserEvents;
    let newDerivedObject;

    oldObject = [userEventDetail];

    if (oldObject == "" || oldObject == undefined) {
      currentUserEvents = [JSON.parse(JSON.stringify(newObject))];
      newObject.userEvents[0].date = date;
      console.log(`New derived object: ${JSON.stringify(newObject)}`);
      storeUserEvent([newObject]);
    } else {
      let todayObject = oldObject;

      if (!todayObject) {
        currentUserEvents = oldObject;

        newObject.userEvents.forEach((newEvent) => {
          console.log(JSON.stringify(newEvent));
          currentUserEvents[0].userEvents.push(newEvent);
        });
      } else {
        newDerivedObject = JSON.parse(todayObject);

        if (newObject.userEvents && Array.isArray(newObject.userEvents)) {
          newObject.userEvents.forEach((newEvent, index) => {
            newDerivedObject[0].userEvents[index] =
              newDerivedObject[0].userEvents[index] || {};

            for (let screen in newEvent) {
              newDerivedObject[0].userEvents[index][screen] =
                newDerivedObject[0].userEvents[index][screen] || {};

              for (let button in newEvent[screen]) {
                newDerivedObject[0].userEvents[index][screen][button] =
                  (newDerivedObject[0].userEvents[index][screen][button] || 0) +
                  (newEvent[screen][button] || 0);
              }
            }
          });
        }

        newDerivedObject[0].userEvents[0].date = date;
        console.log("New Dervied Object" + JSON.stringify(newDerivedObject));
        const requestData = newDerivedObject[0];
        storeUserEvent([requestData]);
      }
    }

    responseToDB = sessionStorage.getItem("userevents");

    if (responseToDB) {
      const parsedData = JSON.parse(responseToDB);
      // Access userEvents key
      const userEvents = parsedData[0].userEvents;
      requesteDataToDB = JSON.stringify(userEvents);
    }
  }
  console.log("responseToDB", responseToDB);

  async function sendUserEventData() {
    if (isResponseToDB) {
      const userId = getCookie("userId");

      const response = await fetch(
        `https://webanalyticals.onrender.com/updateUserEvents/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requesteDataToDB,
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching config data: ${response.status}`);
      }

      const configData = await response.json();
      console.log("Config Data:", configData);
      sessionStorage.clear();

      if (requesteDataToDB.length) {
        isResponseToDB = false;
        requesteDataToDB = [];
      }
    }
  }
  sendUserEventData(); // Call sendData immediately if there's data
  function sendUserEventDataCall() {
    serverUpdateTime = getCookie("serverUpdateTime");

    if (serverUpdateTime != null) {
      console.log("Server update time" + serverUpdateTime);
      setInterval(sendUserEventData, serverUpdateTime);
      clearInterval(setTintervalTimer);
    }
  }

  const setTintervalTimer = setInterval(sendUserEventDataCall, 1000);

  function handleButtonClick(event) {
    const target = event.target;
    const isButton = target.tagName === "BUTTON" || target.closest("button");
    const linkElement = target.tagName === "A" ? target : target.closest("a");

    if (isButton) {
      const buttonElement =
        target.tagName === "BUTTON" ? target : target.closest("button");
      const parentButtonContent = getParentContent(buttonElement, "button");
      updateClickCount(parentButtonContent, "btn_");
      changedPageName(isPageChanged);
    } else if (linkElement) {
      const parentLinkContent = getParentContent(linkElement, "link");
      updateClickCount(parentLinkContent, "link_");
      changedPageName(isPageChanged);
    }
  }

  function getParentContent(element, type) {
    let parentContent = element.textContent.trim();
    let parentElement = element.parentElement.closest(type);

    while (parentElement) {
      parentContent = parentElement.textContent.trim();
      parentElement = parentElement.parentElement.closest(type);
    }
    return parentContent;
  }

  document.addEventListener("click", handleButtonClick);
})();

function startObserving() {
  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    newPageName = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);

    if (newPageName !== pageName) {
      isPageChanged = true;
    }
  });

  const targetNode = document.body;
  const observerConfig = { subtree: true, childList: true };
  observer.observe(targetNode, observerConfig);
}

document.addEventListener("DOMContentLoaded", startObserving);
