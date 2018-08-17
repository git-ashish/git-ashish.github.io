// URL: https://beta.observablehq.com/@git-ashish/connected-particles
// Title: Connected Particles 
// Author: Ashish Singh (@git-ashish)
// Version: 190
// Runtime version: 1

const m0 = {
  id: "82a060fd66cb00b1@190",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Connected Particles 

* Some particles on a random walk, with lines connecting nearby particles.
* Tap/Move mouse to introduce a point at cursor position
* Nodes are reactive. Contact between nodes transfers the colors to other nodes`
)})
    },
    {
      name: "canvas",
      inputs: ["DOM","width","d3"],
      value: (function*(DOM,width,d3)
{
  const height = window.screen.height || 600;
  const radius = 2.25;
  const minDistance = 40;
  const maxDistance = 60;
  const minDistance2 = minDistance * minDistance;
  const maxDistance2 = maxDistance * maxDistance;
  const tau = 2 * Math.PI;
  const dpi = devicePixelRatio || 1;
  const canvas = DOM.canvas(width * dpi, height * dpi);
  const context = canvas.getContext("2d");
  let pointLinkMap = {};
  const gcLimit = 10;
  const color = function(){ return '#ffffff'; };  //d3.interpolateRainbow
  canvas.style.width = `${width}px`;
  context.scale(dpi, dpi);

  let n = 150;
  const particles = new Array(n);
  for (let i = 0; i < n; ++i) {
    particles[i] = {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      radius: radius,
      connections: 1,
      color: color(i/n)
    };
  }
    
  function moved() {
    let m = d3.mouse(this);
    particles[0] = {
      x: m[0],
      y: m[1],
      vx: 0,
      vy: 0,
      radius: radius,
      connections: 0,
      color: color(m[0]/width)
    };
    n = particles.length;
  }
  d3.select(canvas).on("touchmove mousemove", moved);
  
  // Shooting star
  setInterval(function(){
      const pos = parseInt(Math.random()*n);
      const star = {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 10,
        vy: 10,
        radius: radius,
        connections: 0,
        color: color(Math.random())
      };
      particles.splice(pos, 1, star);
    }, 5000);
 

  while (true) {
    context.save();
    context.clearRect(0, 0, width, height);

    for (let i = 0; i < n; ++i) {
      const p = particles[i];
      p.x += p.vx;
      if (p.x < -maxDistance) p.x += width + maxDistance * 2;
      else if (p.x > width + maxDistance) p.x -= width + maxDistance * 2;
      p.y += p.vy;
      if (p.y < -maxDistance) p.y += height + maxDistance * 2;
      else if (p.y > height + maxDistance) p.y -= height + maxDistance * 2;
      p.vx += .1 * (Math.random() - .5) - 0.01 * p.vx - 0.00 * p.radius;
      p.vy += .1 * (Math.random() - .5) - 0.01 * p.vy - 0.00 * p.radius;
      context.beginPath();
      context.arc(p.x, p.y, p.radius, 0, tau);
      context.fillStyle = p.color;
      context.fill();
    }

    for (let i = 0; i < n; ++i) {
      for (let j = i + 1; j < n; ++j) {
        const pi = particles[i];
        const pj = particles[j];
        const dx = pi.x - pj.x;
        const dy = pi.y - pj.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxDistance2) {
          context.globalAlpha = d2 > minDistance2 ? (maxDistance2 - d2) / (maxDistance2 - minDistance2) : 1;
          context.beginPath();
          context.moveTo(pi.x, pi.y);
          context.lineTo(pj.x, pj.y);
          // exchange colors on contact
          if(pi.color != pj.color){
            pj.color = pi.color;
          }
          context.strokeStyle = pi.color;
                              
          context.stroke();
                    
        }
      }

    }
    
    context.restore();
    yield canvas;
  }
  
  
}
)
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3")
)})
    }
  ]
};

const notebook = {
  id: "82a060fd66cb00b1@190",
  modules: [m0]
};

export default notebook;