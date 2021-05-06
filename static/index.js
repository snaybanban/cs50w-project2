document.addEventListener('DOMContentLoaded', () => {

    if  (!localStorage.getItem('channel'))
    {
        localStorage.setItem('channel',"general");
    }    
    else
    {
        const name = localStorage.getItem('channel');
        if ( name !== "general")
        {
            console.log(name);
            console.log(document.querySelector("#" + CSS.escape(name) ));
        const request = new XMLHttpRequest();
        request.open('POST', '/getmessages');

        // Callback function for when request completes
        request.onload = () => {

            // Extract JSON data from request
            const data = JSON.parse(request.responseText);

            console.log(data);
        if (data.channel_found)
        {    
            if (data.length !== 0){
            // Update the messages
                data.messages.forEach(message =>{
                const contents = messagetemplate({'message_sender':message["sender"],'message_text':message["text"],'message_datetime':message["datetime"]}); 
                document.querySelector('#messagecontainer').innerHTML += contents;
                });
            }
            else{
                document.querySelector('#messagecontainer').innerHTML = "";
            }
                
            // update the heading
                document.querySelector('#channelheading').innerHTML = name;
        }
    };
       
        const data = new FormData();
        data.append('channelname',name);
        request.send(data);
    }
    }

    // chat
    document.querySelector('#submit').disabled = true;

    // Enable button only if there is text in the input field
    document.querySelector('#task').onkeyup = () => {
        document.querySelector('#submit').disabled = false;
    };

    document.querySelector('#new-msj').onsubmit = () => {

        // Create new item for list
        const li = document.createElement('li');
        li.innerHTML = document.querySelector('#task').value;

        // Add new item to task list
        document.querySelector('#tasks').append(li);

        // Clear input field and disable button again
        document.querySelector('#task').value = '';
        document.querySelector('#submit').disabled = true;

        // Stop form from submitting
        return false;
    };

});