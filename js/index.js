document.addEventListener('DOMContentLoaded', () => {

    //store page number and start at 1
    let currentPage = 1;

    //get all html elements 
    const monsterContainer = document.getElementById('monster-container');
    const createMonsterDiv = document.getElementById('create-monster');
    const backButton = document.getElementById('back');
    const forwardButton = document.getElementById('forward');
  
    //my api url
    const API_URL = 'http://localhost:3000/monsters'; 
  
    // i need an async function that will be effect after its done fetching and not preventing other funtion to occur
    // my async function 
    async function fetchMonsters(page) {
        //i want to see if try will work and if an error occur am able to catch it
      try {
        //after i fetch my page i store that response in a variable
        const response = await fetch(`${API_URL}?_limit=50&_page=${page}`);

        //bring a condition that bring an error if response fails
        if (!response.ok) throw new Error('Failed to fetch monsters');
        const monsters = await response.json();
        renderMonsters(monsters);
      } catch (error) {
        console.error(error);
      }
    }
  
    // on successfully fetching the page i need to render my list of monster
    // my render function
    function renderMonsters(monsters) {
        //am adding this list to moster container i got it element before
      monsterContainer.innerHTML = '';
      //i need to iterate over all monster i get and store them in a div
      monsters.forEach(monster => {

        //i create the div i will store each of these monster
        const monsterDiv = document.createElement('div');
        //the div need a classname
        monsterDiv.className = 'monster';
        //i also need to add h2, h4, p to this div i will use the innerHTml way
        monsterDiv.innerHTML = `
          <h2>${monster.name}</h2>
          <h4>Age: ${monster.age}</h4>
          <p>${monster.description}</p>
        `;
        //for it to effective i need to add it to its parent element
        monsterContainer.appendChild(monsterDiv);
      });
    }
  
    // i also need to  have a form to create a new monster
    // my function that helps me create this form
    function createMonsterForm() {
        //i need to create the html element of form to reflect
      const form = document.createElement('form');
      //this form element needs an id
      form.id = 'monster-form';
  
      //it needs the particulars of a form that makes it a form like the input fields
      form.innerHTML = `
        <input type="text" id="name" placeholder="Name" required />
        <input type="number" id="age" placeholder="Age" required />
        <input type="text" id="description" placeholder="Description" required />
        <button type="submit">Create Monster</button>
      `;
  
      //its purpose is once filled and user clicks submit it should do something
      //first it needs to listen to an action on submit button
      form.addEventListener('submit', async event => {
        //and not to forget i need to prevent default form behavior
        event.preventDefault();
        //all particulars of the form i will stop in each specific variable
        //we added these particulars using innerhtml
        const name = form.name.value;
        const age = parseInt(form.age.value);
        const description = form.description.value;
  
        //i now need to fetch my url and post
        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, age, description }),
          });
  
          //incase an error occur we need to catch it
          if (!response.ok) throw new Error('Failed to create monster');
          //then we reset the form
          form.reset();
          fetchMonsters(currentPage); 
        } catch (error) {
          console.error(error);
        }
      });
  
      createMonsterDiv.appendChild(form);
    }
  
    // we need to move to previous or next page on press of the button
    //so we need our js to listen to this
    //start with one that move to previous page
    backButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchMonsters(currentPage);
      }
    });
  
    //then the one that got to next page
    forwardButton.addEventListener('click', () => {
      currentPage++;
      fetchMonsters(currentPage);
    });
  
    // all said and done we start our app by initializing the functions that makes this happen
    createMonsterForm();
    fetchMonsters(currentPage);
  });
  