// var usernames= []


// if(storedNames){
//     usernames=JSON.parse(storedName)
// }
 // random user name generation
 const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 function generateString(length) {
     let result = ' ';
     const charactersLength = characters.length;
     for ( let i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
 }
 //Ti find the browser
 var browserName = "";
 var userAgent = navigator.userAgent;
 console.log(userAgent)
 if (userAgent.indexOf("Firefox") > -1) {
   browserName = "Mozilla Firefox";
 }else if (userAgent.search("Edg/") > -1) {
   browserName = "Microsoft Edge";
 } else if (userAgent.indexOf("Chrome") > -1) {
   browserName = "Google Chrome";
 } else if (userAgent.indexOf("Safari") > -1) {
   browserName = "Apple Safari";
 } else if (userAgent.indexOf("Opera") > -1) {
   browserName = "Opera";
 } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) {
   browserName = "Internet Explorer";
 } else {
   browserName = "Unknown Browser";
 }
 //logged time and date
 var getDate = new Date();
 var year = getDate.getFullYear();
 var month = (getDate.getMonth() + 1).toString().padStart(2, "0");
 var day = getDate.getDate();
 var date = year + "" + month + "" + day.toLocaleString();
 var hh = getDate.getHours();
 var mm = getDate.getMinutes();
 var ss = getDate.getSeconds();
 var time =hh.toLocaleString()+ ":" + mm.toLocaleString() + ":" + ss.toLocaleString();
 // console.log("System Username: " + username);
 // console.log("Browser Name: " + browserName);
 var obj={}
 
 //function to store in Session storage
 function storage(value){
   sessionStorage.setItem("usernames", JSON.stringify(value));  
 }
 
 //to get ip adress
 fetch('https://api.ipify.org?format=json')
   .then(response => response.json())
   .then(data => {
     const ipAddress = data.ip;
     console.log('User IP address:', ipAddress);
     var storedName=sessionStorage.getItem("usernames")
   obj={
         'userInfo':[{
             ip : ipAddress,
             userName: generateString(5),
             browserName:browserName,
             dates:date,
             time:time
         }],
         'userEvents':[
 
         ]
             
       }
   fetch('https://jsonplaceholder.typicode.com/todos/1')
   .then(function(response) {
     if (response.ok) {
       console.log(JSON.stringify(obj))
     } else {
       throw new Error('API request failed');
     }
   })
   .catch(function(error) {
     console.log(error);
   });
  
     
     
     try {
       var userNameKey=JSON.parse(sessionStorage.usernames)
       var ipCheck=userNameKey.userInfo[0].ip
     }
     catch {
       storage(obj)
     }
     var userNameKey=JSON.parse(sessionStorage.usernames)
     var ipCheck=userNameKey.userInfo[0].ip
     if(ipAddress!= ipCheck){
       storage(obj)
     }
  
   })
   .catch(error => {
     console.error('Error:', error);
   });
 var ls=['1']
 var currentURL = window.location.href;
 var pageName = currentURL.substring(currentURL.lastIndexOf("/") + 1);
 console.log("page name"+pageName)
 // obj.userEvents[0]=pageName
 // console.log(JSON.stringify(obj))
   // const buttons = document.querySelectorAll('button');
   // for(let i=0;i<buttons.length;i++){
   //   buttons[i].addEventListener("click",function(event){
       
 
   //   })
   // }
   // console.log(ls)
 var ls={}
 // document.addEventListener("DOMContentLoaded", function() {
 //   // Function to check buttons on the screen
 //   function checkButtons() {
 //       const buttons = document.querySelectorAll("button");
       
 //       if (buttons.length === 0) {
 //           console.log("No buttons found on the screen.");
 //       } else {
 //           console.log("Buttons found on the screen:");
 //           buttons.forEach((button, index) => {
 //               console.log(`Button ${index + 1}: ${button.textContent}`);
 //               let clickCount = 0;
 //               button.addEventListener("click", function() {
 //                 console.log("dfdafa")
 //                   clickCount++;
 //                   console.log(`Button ${index + 1} clicked ${clickCount} time(s).`);
 //               });
 //           });
 //       }
 //   }
   
 //   // Call the function to check buttons on the screen
 //   checkButtons();
 // });
 
 const clickCounts = {};
 var buttonsInPage={}
 var ad={}
 // Function to update the click count and display the result
 function updateClickCount(tagId,tagtype) {
 
   if (!clickCounts[tagId]) {
     clickCounts[tagId] = 1;
   } else {
     clickCounts[tagId]++;
   }
 
   const clickCountDisplay = document.getElementById(`${tagId}_click_count`);
   if (clickCountDisplay) {
     clickCountDisplay.textContent = clickCounts[tagId];
     console.log(clickCountDisplay)
   }
 console.log(`Button ${tagId}: ${clickCounts[tagId]}`); 
 buttonsInPage[`${tagtype}${tagId}`]=clickCounts[tagId]
 console.log(JSON.stringify(buttonsInPage))
 ad[pageName]=[buttonsInPage]
 obj.userEvents=[ad]
 //ad[buttonId]=clickCounts[buttonId]
 console.log(JSON.stringify(obj))
 storage(obj)
 
 }
 
 // Event listeners for each button
 const buttons = document.querySelectorAll('button');
 buttons.forEach(button => {
   button.addEventListener('click', () => {
     const buttonId = button.textContent;
     updateClickCount(buttonId,'btn_');
   });
 });
 
 
 const links=document.querySelectorAll("a");
 links.forEach(link => {
   link.addEventListener('click', () => {
     const linkId = link.textContent;
     updateClickCount(linkId,'link_');
   });
 });
 