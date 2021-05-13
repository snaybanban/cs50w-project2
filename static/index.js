document.addEventListener('DOMContentLoaded', () => {
    // conectar al web socket
      var socket = io.connect(location.protocol+'//' + document.domain + ':' + location.port);
        socket.on('connect', () => {
            // notifica al servidor una nueva conexión
            socket.emit('join');
          
            document.querySelector('#submit').disabled = true;
    
            // Habilitar botón solo si hay texto en el campo de entrada
            document.querySelector('#task').onkeyup = () => {
                if (document.querySelector('#task').value.length > 0)
                    document.querySelector('#submit').disabled = false;
                else
                    document.querySelector('#submit').disabled = true;
            };
          
           document.querySelector('#new-task').onsubmit = () => {
    
                const mensaje = document.querySelector('#task').value;
    
                // Borra el campo de entrada y deshabilite el botón nuevamente
                document.querySelector('#task').value = '';
                document.querySelector('#submit').disabled = true;
                socket.emit('submit mensaje', {'mensaje': mensaje});
                return false;
            };       
    
        });
        

        socket.on('joined', data => {
            const li = document.createElement('li');
            li.className = 'list'
            li.innerHTML = `<b>${data.mensaje}`;
            document.querySelector('#tasks').append(li);
            console.log("añadido");
        });
      
        socket.on('announce mensaje', data => {
            let local = localStorage.getItem("localuser")
            console.log(local)
            const li = document.createElement('li');
            if (data.user != local) {
                li.className = 'client-chat'
            }  
            else {
                li.className = 'my-chat'
            }
                
            li.innerHTML = `<b>${data.user}:</b> ${data.mensaje} <br> ${data.tiempo} `;
            document.querySelector('#tasks').append(li);
            $(".chats").animate({ scrollTop: $('.chats').prop("scrollHeight")}, 800);
        });
    
    });