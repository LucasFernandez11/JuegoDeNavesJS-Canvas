function initCanvas(){
    const ctx = document.getElementById('my_canvas').getContext('2d');
    const backgroundImage = new Image();
    const naveImage   = new Image(); // nave
    const enemiespic1  = new Image(); // enemigo 1
    const enemiespic2 = new Image(); // enemigo 2

    // backgroundImage y naveImage
    backgroundImage.src = "images/background-pic.jpg"; //Background images
    naveImage.src       = "images/spaceship-pic.png"; //Spaceship images
    // Enemigos fotos
    enemiespic1.src     = "images/enemigo1.png";
    enemiespic2.src     = "images/enemigo2.png"; //Enemigo images
    
    // width y height (canvas)
    const cW = ctx.canvas.width; // 700px 
    const cH = ctx.canvas.height;// 600px

    // template de naves- 
    function enemyTemplate(options) {
        return ({
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        });
    }

    // creando las naves enemigas
    const enemies = [
                   new enemyTemplate({id: "enemy1", x: 100, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy2", x: 225, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy3", x: 350, y: -20, w: 80, h: 30 }),
                   new enemyTemplate({id: "enemy4", x:100,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy5", x:225,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy6", x:350,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy7", x:475,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy8", x:600,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy9", x:475,  y:-20,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy10",x: 600, y: -20, w: 50, h: 30}),

                   // Segundo grupo de enemigos
                   new enemyTemplate({ id: "enemy11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy20", x: 600, y: -200, w: 50, h: 30, image: enemiespic2 })
                  ];

   //array de enemigos
    // obliga tambien al enemigo a detectar si golpea al jugador
    const renderEnemies = (enemyList) => {
        for (let i = 0; i < enemyList.length; i++) {
            console.log(enemyList[i]);
            // drawImage: esta funcion es predefinida de canvas para mostrar la img dentro de canvas    
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h);
            // destecta cuando el enemigo alcanza el nivel inferior
            launcher.hitDetectLowerLevel(enemyList[i]);
        }
    }

    function Launcher(){
        // ubicación de balas
        this.y = 500, 
        this.x = cW*.5-25, 
        this.w = 100, 
        this.h = 100,   
        this.direccion, 
        this.bg="white", // (color de bala)
        this.misiles = [];

         // mensaje al perder
         this.gameStatus = {
            over: false, 
            message: "",
            fillStyle: 'red',
            font: 'italic bold 36px Arial, sans-serif',
        }

        this.render = function () {
            if(this.direccion === 'left'){
                this.x-=5;
            } else if(this.direccion === 'right'){
                this.x+=5;
            }else if(this.direccion === "downArrow"){
                this.y+=5;
            }else if(this.direccion === "upArrow"){
                this.y-=5;
            }
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10); // background image
            ctx.drawImage(naveImage,this.x,this.y, 100, 90); // ubicar la nave en la misma posicion de las balas

            for(let i=0; i < this.misiles.length; i++){
                let m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h); // direccion de bala
                this.hitDetect(this.misiles[i],i);
                if(m.y <= 0){ //si el misil pasa los limites removerlo
                    this.misiles.splice(i,1); 
                }
            }
            // esto pasa al ganar
            if (enemies.length === 0) {
                clearInterval(animateInterval); //detener animacion
                ctx.fillStyle = 'yellow';
                ctx.font = this.gameStatus.font;
                ctx.fillText('Has ganado!', cW * .5 - 80, 50);
            }
        }
        // Detectar impacto de bala
        this.hitDetect = function (m, mi) {
            console.log('crush');
            for (let i = 0; i < enemies.length; i++) {
                let e = enemies[i];
                if(m.x+m.w >= e.x && 
                   m.x <= e.x+e.w && 
                   m.y >= e.y && 
                   m.y <= e.y+e.h){
                    this.misiles.splice(this.misiles[mi],1); // Remover misil
                    enemies.splice(i, 1); // Remover enemigo cuando pega el misil
                    document.querySelector('.barra').innerHTML = "Destroyed "+ e.id+ " ";
                }
            }
        }
        
        this.hitDetectLowerLevel = function(enemy){
            
            if(enemy.y > 550){
                this.gameStatus.over = true;
                this.gameStatus.message = 'los enemigos han pasado!';
            }
            // Esto detecta un choque de la nave con enemigos
            // console.log(this);
            
            if(enemy.id === 'enemy3'){
                //console.log(this.y);
                console.log(this.x);
            }
            
            if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)) { //chequear si el enemigo esta a la izquierda o derecha
                    this.gameStatus.over = true;
                    this.gameStatus.message = 'Has muero!'
                }

            if(this.gameStatus.over === true){  
                clearInterval(animateInterval); // detener el loop de la animacion
                ctx.fillStyle = this.gameStatus.fillStyle; // cargar color de texto
                ctx.font = this.gameStatus.font;
                // mostrar texto en canvas
                ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50); // texto x , y
            }
        }
    }
    
    const launcher = new Launcher();
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }
    const animateInterval = setInterval(animate, 6);
    
    const left_btn  = document.getElementById('left_btn');
    const right_btn = document.getElementById('right_btn');
    const fire_btn  = document.getElementById('fire_btn'); 

   document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) // flecha izquerda
        {
         launcher.direccion = 'left';  
            if(launcher.x < cW*.2-130){
                launcher.x+=0;
                launcher.direccion = '';
            }
       }    
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37) //flecha izquierda
        {
         launcher.x+=0;
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 39) // flecha derecha
        {
         launcher.direccion = 'right';
         if(launcher.x > cW-110){
            launcher.x-=0;
            launcher.direccion = '';
         }
        
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 39) // flecha derecha
        {
         launcher.x-=0;   
         launcher.direccion = '';
        }
        
    }); 

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 38) // flecha arriba
         {
           launcher.direccion = 'upArrow';  
           if(launcher.y < cH*.2-80){
              launcher.y += 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keyup', function(event){
         if(event.keyCode == 38) // flecha arriba
         {
           launcher.y -= 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 40) // flecha abajo
         {
           launcher.direccion = 'downArrow';  
          if(launcher.y > cH - 110){
            launcher.y -= 0;
            launcher.direccion = '';
           }
         }
    });
    document.addEventListener('keyup', function(event){
         if(event.keyCode == 40) //flecha abajo
         {
           launcher.y += 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 80) // restart game
         {
          location.reload();
         }
    });

    // control buttons
    left_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'left';
    });

    left_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });

    right_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'right';
    });

    right_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });
    //este codigo dispara balas
    fire_btn.addEventListener('mousedown', function(event) {
        launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
    });
    // esto activa al apretar la barra espaciadora
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32) {
           launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10});
        }
    });
}

window.addEventListener('load', function(event) {
    initCanvas();
});
