const canvas = document.querySelector
    ('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = innerWidth
    canvas.height = innerHeight

class Bola{
    constructor(x, y,){
        this.x = x
        this.y = y
        this.radius = 10
    }
    dibujar() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
}

let bola = new Bola(canvas.width /2 , canvas.height /2)
bola.dibujar()