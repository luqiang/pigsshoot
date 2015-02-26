class BattleLayer extends egret.Sprite {

    private pigShoot: egret.Bitmap;
    private btnUp: egret.Bitmap;
    private btnDown: egret.Bitmap;
    private btnUp_down: egret.Bitmap;
    private btnDown_down: egret.Bitmap;


    private line: egret.Bitmap;
   
    private fireBtn: egret.Bitmap;
    private fireBtn_down: egret.Bitmap;
    private speed: number = 0;
    private arrowArray: egret.Bitmap[] = new Array();
    private runArrowArray: egret.Bitmap[] = new Array();

    private wolfArray: Wolf[] = new Array();
    private runWolfArray: Wolf[] = new Array();
    private standWolfArray: Wolf[] = new Array();

    //炸点 狼的反击
    private bombArray: Bomb[] = new Array();
    private runBombArray: Bomb[] = new Array();

    public wolfUpY: number = 0;


    private pig_heart: number = 3;
    private pig_heartTxt: egret.TextField = new egret.TextField();
    private pig_heartBitmap: egret.Bitmap;
    private missonLevel: number = 1;
    private wolfIco: egret.MovieClip;
    private wolfNumber: number = 10*this.missonLevel;
    private wolfNumberTxt: egret.TextField = new egret.TextField();


    private myTime: egret.Timer = new egret.Timer(2000, this.wolfNumber);
    private pig_hitting: boolean = false; //猪是否在攻击中

    private dialog: DialogGame = new DialogGame();
    private isWolfRunningOver: boolean = false;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.init();
        this.addEvent();
      

    }

    private onAddToStage(event: egret.Event): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        var texture: egret.Texture = RES.getRes("pig_png");
        this.pigShoot = new egret.Bitmap(texture);
        this.addChild(this.pigShoot);
        this.pigShoot.x = 70;
        this.pigShoot.y = 120;
        this.drawLine();

    }
    private init(): void {

        this.btnUp_down = new egret.Bitmap();
        this.btnUp_down.texture = RES.getRes("upbtn_down_png");
        this.addChild(this.btnUp_down);
        this.btnUp_down.x = 50;
        this.btnUp_down.y = 580;

        this.btnUp = new egret.Bitmap();
        this.btnUp.texture = RES.getRes("upbtn_png");
        this.btnUp.touchEnabled = true;
        this.addChild(this.btnUp);
        this.btnUp.x = 50;
        this.btnUp.y = 580;

        this.btnDown_down = new egret.Bitmap();
        this.btnDown_down.texture = RES.getRes("downbtn_down_png");
        this.addChild(this.btnDown_down);
        this.btnDown_down.x = 50;
        this.btnDown_down.y = 660;

        this.btnDown = new egret.Bitmap();
        this.btnDown.texture = RES.getRes("downbtn_png");
        this.btnDown.touchEnabled = true;
        this.addChild(this.btnDown);
        this.btnDown.x = 50;
        this.btnDown.y = 660;


        this.line = new egret.Bitmap();
        this.line.texture = RES.getRes("line_png");
        this.addChild(this.line);
        this.line.x = 94;
        this.line.y = 115;


        this.fireBtn_down = new egret.Bitmap();
        this.fireBtn_down.texture = RES.getRes("firebtn_down_png");
        this.addChild(this.fireBtn_down);
        this.fireBtn_down.x = 370;
        this.fireBtn_down.y = 620;


        this.fireBtn = new egret.Bitmap();
        this.fireBtn.texture = RES.getRes("firebtn_png");
        this.fireBtn.touchEnabled = true;
        this.addChild(this.fireBtn);
        this.fireBtn.x = 370;
        this.fireBtn.y = 620;


        this.pig_heartBitmap = new egret.Bitmap();
        this.pig_heartBitmap.texture = RES.getRes("heart_png");
        this.addChild(this.pig_heartBitmap);
        this.pig_heartBitmap.y = 15;
        this.pig_heartBitmap.x = 5;

        this.pig_heartTxt.text = "X"+this.pig_heart;
        this.pig_heartTxt.x = 40;
        this.pig_heartTxt.y = 10;
        this.addChild(this.pig_heartTxt);
        //创建狼
        var wolfData = RES.getRes("wolf_json");
        var wolfPng = RES.getRes("wolf_png");
        var mcDataFactory = new egret.MovieClipDataFactory(wolfData, wolfPng);
        this.wolfIco = new egret.MovieClip(mcDataFactory.generateMovieClipData("wolf"));
        this.addChild(this.wolfIco);
        this.wolfIco.y = 10;
        this.wolfIco.scaleX = this.wolfIco.scaleY = 0.5;
        this.wolfIco.x = this.width - 80;

        this.wolfNumberTxt = new egret.TextField();
        this.addChild(this.wolfNumberTxt);
        this.wolfNumberTxt.x = this.wolfIco.x + 30;
        this.wolfNumberTxt.y = this.wolfIco.y;
        this.wolfNumberTxt.text = "X" + this.wolfNumber;

     
    }

    private addEvent(): void {
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.upHandler, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_END, this.upHandler, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.upHandler, this);

        this.btnDown.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.downHandler, this);
        this.btnDown.addEventListener(egret.TouchEvent.TOUCH_END, this.downHandler, this);
        this.btnDown.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.downHandler, this);

        this.addEventListener(egret.Event.ENTER_FRAME, this.onFrameHandler, this);

        this.fireBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onFire, this);
        this.fireBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onFire, this);
        this.fireBtn.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onFire, this);

        this.myTime.addEventListener(egret.TimerEvent.TIMER, this.createWolf, this);
        this.myTime.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.wolfRunOver, this);
        this.myTime.start();
       
        
    }
    private removeEvent(): void {
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.upHandler, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_END, this.upHandler, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.upHandler, this);

        this.btnDown.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.downHandler, this);
        this.btnDown.removeEventListener(egret.TouchEvent.TOUCH_END, this.downHandler, this);
        this.btnDown.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.downHandler, this);

        this.removeEventListener(egret.Event.ENTER_FRAME, this.onFrameHandler, this);
        this.fireBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onFire, this);
        this.fireBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onFire, this);
        this.fireBtn.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onFire, this);

        this.myTime.stop();
        this.myTime.removeEventListener(egret.TimerEvent.TIMER, this.createWolf, this);
        this.myTime.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.wolfRunOver, this);


        this.btnUp.visible = true;
        this.btnDown.visible = true;
        this.fireBtn.visible = true;
        this.speed = 0;
    }

    private onFire(evt: egret.TouchEvent): void {
        if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
            var tempArrow: egret.Bitmap = this.getArrow();
            this.addChild(tempArrow);
            tempArrow.visible = true;
            tempArrow.rotation = 0;
            tempArrow.x = this.pigShoot.width + 60;
            tempArrow.y = this.pigShoot.y + 30;
            this.runArrowArray.push(tempArrow);
            this.fireBtn.visible = false;
        } else {
            this.fireBtn.visible = true;
        }


    }
    private upHandler(evt: egret.TouchEvent): void {
      
        if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
            this.speed = -4;
            if (this.btnUp.visible == true) {
                this.btnUp.visible = false;
            }
        } else if (evt.type == egret.TouchEvent.TOUCH_END || evt.type == egret.TouchEvent.TOUCH_RELEASE_OUTSIDE) {           
            this.speed = 0;
            this.btnUp.visible = true;
        }
    }
    private downHandler(evt: egret.TouchEvent): void {
        if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
            this.speed = 4;
            if (this.btnDown.visible == true) {
                this.btnDown.visible = false;
            }
        } else if (evt.type == egret.TouchEvent.TOUCH_END || evt.type == egret.TouchEvent.TOUCH_RELEASE_OUTSIDE) {
            this.speed = 0;
            this.btnDown.visible = true;
        }
    }
    private onFrameHandler(evt: egret.Event): void {
        if (this.speed != 0) {
            this.pigShoot.y += this.speed;
            if (this.pigShoot.y > 650) {
                this.pigShoot.y = 650;
            }
            if (this.pigShoot.y < 120) {
                this.pigShoot.y = 120;
            }
            this.drawLine();
        }
        if (this.runArrowArray.length > 0)
        {
            for (var index: number = 0; index < this.runArrowArray.length; index++) {
                var tempArrow: egret.Bitmap = this.runArrowArray[index];
                if (tempArrow.rotation == 0) {
                    tempArrow.x += 15;
                } else {
                    tempArrow.y += 15;
                }          
                if (tempArrow.x >= 420||tempArrow.visible==false||tempArrow.y>680) { //边界大于删掉键 或者消失
                    this.runArrowArray.splice(index,1);
                    this.arrowArray.push(tempArrow);
                    this.removeChild(tempArrow);
                }

            }
        }
        if (this.runWolfArray.length > 0) {
            for (var index: number = 0; index < this.runWolfArray.length; index++) {
                var tempWolf: Wolf = this.runWolfArray[index];
                tempWolf.logic();
                if (tempWolf.state == 3) { //设置为死亡
                    this.runWolfArray.splice(index, 1);
                    this.wolfArray.push(tempWolf);
                }
                if (tempWolf.state == 5) {
                    this.runWolfArray.splice(index, 1);
                    this.standWolfArray.push(tempWolf);
                }
            }
        }
        this.hitLogic();

        if (this.runBombArray.length > 0)
        {
            for (var index: number = 0; index < this.runBombArray.length; index++) {
                var bomb: Bomb = this.runBombArray[index];
                if (bomb.running == true) {
                    bomb.logic();
                } else {              
                    this.runBombArray.splice(index, 1);         
                    if (this.contains(bomb) == true) {
                         this.removeChild(bomb);
                    }   
                    this.bombArray.push(bomb);          
                
                }
        
            }
        }
        if (this.pigShoot.hitTestPoint(70, 733+ this.wolfUpY) == true)
        {
            //狼吃到猪了
            this.pigReduce();
        }
        if (this.isWolfRunningOver == true) {
            if (this.runWolfArray.length == 0) {
                console.log("战斗结束玩家赢了")
                this.showWin();

            }
        }
    }
    private hitLogic(): void {
        for (var index: number = 0; index < this.runArrowArray.length; index++) {
            for (var k: number = 0; k < this.runWolfArray.length; k++) {
                var tempWolf: Wolf = this.runWolfArray[k];
                if (tempWolf.state!=1) continue;
                var tempArrow: egret.Bitmap = this.runArrowArray[index]; 
                tempWolf.isBeHit(tempArrow);
                
            }
        }

        for (var index: number = 0; index < this.runBombArray.length; index++) {
            var bomb: Bomb = this.runBombArray[index];
            if (this.pigShoot.hitTestPoint(bomb.x, bomb.y) == true)
            {        
                bomb.running = false;
                this.pigReduce();
            }
        }
    }
    private pigReduce(): void {
        if (this.pig_hitting == true) return;
        this.pig_hitting = true;
        this.pig_heart--;
        if (this.pig_heart < 0) {
            this.pigDead();
        } else {
            this.pig_heartTxt.text = "X" + this.pig_heart;
            this.flashPig();
        }
    }
    private pigDead(): void {  
        egret.Tween.get(this.pigShoot).to({ x: 300, y: 675,rotation:90},1000).call(this.pigDeadOver,this);
    }
    private pigDeadOver(): void {
        this.removeEvent();        
        this.addChild(this.dialog);
        this.dialog.x = (this.width - this.dialog.width) / 2;
        this.dialog.y = (this.height - this.dialog.height) / 2;
        this.dialog.showDialog("重新开始");
        this.dialog.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resetGame, this);
    }
    private showWin(): void {
        this.removeEvent();
        this.addChild(this.dialog);
        this.dialog.x = (this.width - this.dialog.width) / 2;
        this.dialog.y = (this.height - this.dialog.height) / 2;
        this.dialog.showDialog("胜利!进入下一关");
        this.dialog.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextMission, this);
    }
    private nextMission(evt:egret.TouchEvent): void {
        this.dialog.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextMission, this);
        this.removeChild(this.dialog);
        this.isWolfRunningOver = false;
        this.missonLevel++;
        this.pigShoot.x = 70;
        this.pigShoot.y = 120;
        this.pigShoot.rotation = 0;
        this.drawLine();
        this.pig_hitting = false;
        this.wolfUpY = 0;
        this.wolfNumber = 10 * this.missonLevel;
        this.pig_heart++;

        this.myTime.repeatCount = this.wolfNumber;
        this.myTime.reset();

        this.clearBattle();

        this.addEvent();

        this.refreshTxt();
    }
    private resetGame(evt: egret.TouchEvent): void {
        this.dialog.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.resetGame, this);
        this.removeChild(this.dialog);


        this.pigShoot.x = 70;
        this.pigShoot.y = 120;
        this.pigShoot.rotation = 0;
        this.drawLine();
        this.pig_hitting = false;
        this.wolfUpY = 0;
        this.wolfNumber = 10 * this.missonLevel;
        this.pig_heart = 3;

        this.myTime.repeatCount = this.wolfNumber;
        this.myTime.reset();

        this.clearBattle();

        this.addEvent();

        this.refreshTxt();
    }
    private refreshTxt(): void {
        this.pig_heartTxt.text = "X" + this.pig_heart;
        this.wolfNumberTxt.text = "X" + this.wolfNumber;
    }
    private clearBattle(): void {
      
            while (this.runArrowArray.length > 0){
                    var tempArrow: egret.Bitmap = this.runArrowArray.pop();                    
                    this.arrowArray.push(tempArrow);
                    this.removeChild(tempArrow);
            }
        


            while(this.runWolfArray.length>0) {
                    var tempWolf: Wolf = this.runWolfArray.pop();
                    tempWolf.disPose();
                    this.wolfArray.push(tempWolf);

            }  
            while (this.runBombArray.length>0) {
                var bomb: Bomb = this.runBombArray.pop();
                 bomb.running = false;         
                 this.bombArray.push(bomb);
                 this.removeChild(bomb);
            }
            while (this.standWolfArray.length > 0) {
                var wolf: Wolf = this.standWolfArray.pop();
                wolf.disPose();
                this.wolfArray.push(wolf);
            }
           

    }
    private flashPig(): void {
        var flashTime: egret.Timer = new egret.Timer(100, 14);
        flashTime.addEventListener(egret.TimerEvent.TIMER, this.flashHandler, this);
        flashTime.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.flashOverHandler, this);
        flashTime.start();
    }
    private flashOverHandler(evt: egret.TimerEvent): void {
        this.pig_hitting = false;
    }
    private flashHandler(evt: egret.TimerEvent): void {
        this.pigShoot.visible = !this.pigShoot.visible;
    }
    private drawLine(): void {

        var tempHeight: number = this.pigShoot.y - 95;
        this.line.height = tempHeight;
    }


    private getArrow(): egret.Bitmap{
        var tempArrow: egret.Bitmap;
        if (this.arrowArray.length == 0) {
            var arrow: egret.Bitmap = new egret.Bitmap();
            arrow.texture = RES.getRes("jian_png");
            this.arrowArray.push(arrow);
        }
        tempArrow = this.arrowArray.pop();
        return tempArrow;
    }

    private createWolf(): void {
        if (this.wolfArray.length == 0) {
            var tempWolf: Wolf = new Wolf();
            this.wolfArray.push(tempWolf);
        }
        var wolf: Wolf = this.wolfArray.pop();
        this.addChild(wolf);
        wolf.speed = this.missonLevel;
        wolf.beginRun();
        this.runWolfArray.push(wolf);
        this.wolfNumber--;
        this.wolfNumberTxt.text = "X" + this.wolfNumber;
        

    }
    //可以判断哟西是否结束
    private wolfRunOver(): void {
        console.log("狼跑完了！！！！");
        this.isWolfRunningOver = true;
    }
    public  onBombFire(pos:egret.Point):void {
        if (this.bombArray.length == 0) {
            var bomb: Bomb = new Bomb();
            this.bombArray.push(bomb);
        }
        var bomb1: Bomb = this.bombArray.pop();
        bomb1.setStartPos(pos);
        bomb1.setDestPos(new egret.Point(this.pigShoot.x, this.pigShoot.y));
        bomb1.compute();
        this.addChild(bomb1);
        this.runBombArray.push(bomb1);
        bomb1.onFire();
    }


}