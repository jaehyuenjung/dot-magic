class WorkerManager{
  constructor(count, schedule, loadMap, scaleWidth, scaleHeight){
    this.index = 0;
    this.count = count;
    this.schedule = schedule;
    this.loadMap = loadMap;
    this.scaleWidth = scaleWidth;
    this.scaleHeight = scaleHeight;
    this.workers = Array.from({length: this.count}, () => new Worker(0, 0, schedule, loadMap));
    
    this.randPlace();
  }
  
  //    →(0) 
  //  ↑        ↓
  // (3)      (1)
  //    ←(2)      
  randPlace(){    
    const dirX = [1, 0, -1, 0];
    const dirY = [0, 1, 0, -1];
    const perX = this.scaleWidth / (this.count - 1);
    const perY = this.scaleHeight / (this.count - 1);
    const total = (this.count !== 1)? (this.count - 1) * 4 : 1;
    const visible = Array.from({length: total}, () => true);
    for(let i =0; i < this.count; i++){
      let pos = -1;
      while(pos === -1 || !visible[pos])pos = floor( random(total));
      visible[pos] = false;
    
      let x = 0;
      let y = 0;
      for(let j = 0; j < pos; j ++){
        const dirPos = floor(j / (this.count - 1));
        x += dirX[dirPos] * perX;
        y += dirY[dirPos] * perY;
      }
      
      if(this.workers[i]){
        this.workers[i].move(x, y);
      }else{
        this.workers[i] = new Worker(x, y, this.schedule, this.loadMap);
      }
    }
  }
   
  update(deltaT){
    const toDos = shuffle(Array.from({length: this.count}, (_,i) => this.index + i));
    if(this.index < this.loadMap.length){
      for(let i =0; i< toDos.length; i++){
        if(toDos[i] < this.loadMap.length){
          this.workers[i].update(deltaT, toDos[i]);
        }
      }
      
      this.randPlace();
    }
    this.loadMap.forEach((arr) => arr.forEach((pixel) => pixel.update(deltaT)));
    this.loadMap.forEach((arr) => arr.forEach((pixel) => set(pixel.x, pixel.y, pixel.color)));
    updatePixels();
    if(this.index < this.loadMap.length){
      this.index += this.count;

      for(let i =0; i< toDos.length; i++){
        if(toDos[i] < this.loadMap.length){
          this.workers[i].draw(toDos[i]);
        }
      }
    }
  }
  
  isDone(){
    return this.index >=  this.loadMap.length;
  }
  
  init(count, schedule, loadMap, scaleWidth, scaleHeight){
    this.index = 0;
    this.count = count;
    this.schedule = schedule;
    this.loadMap = loadMap;
    this.scaleWidth = scaleWidth;
    this.scaleHeight = scaleHeight;
    Array.from({length: count}, (_,i) => {
      if(this.workers[i]){
        this.workers[i].init(0, 0, schedule, loadMap);
      }else{
        this.workers[i] = new Worker(0, 0, schedule, loadMap);
      }
    });
    
    this.randPlace();
  }
}