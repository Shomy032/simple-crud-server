const form = document.getElementById('form') 
const btn = document.getElementById('btn')                      
const username = document.getElementById('username')
const password = document.getElementById('password')

form.addEventListener('submit' ,  (e) => {
  e.preventDefault()
 
  let user = username.value;
  let pass = password.value;

  try {
    fetch('http://127.0.0.1:3737/login' , {
         method: 'POST',
         headers: {
        'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           username : user ,
           password : pass
         })
       })
      //  .then(res => res.json())
      //  .then(data => console.log(data))
  
  } catch(err) {
  console.log(err)
  }
   

})


//  fetch('https://httpbin.org/post', {
//   method: 'POST',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({a: 1, b: 'Textual content'})
// });

