class Wolf extends egret.Sprite {
    private wolf: egret.MovieClip;
    private destPointX: number = 0;
    private destPointArray: number[] = [150, 230,310,390];
    //狼的集中状态 0 奔跑 1 坐气球 2死亡 3消失 4奔跑站立等待吃猪 5站立不动叠罗汉状态
    public state: number = 0;
    private qiqiu: egret.Bitmap;
    private wolfQiqiui: egret.Bitmap;
    private wolfDead: egret.Bitmap;

    private timeFire: egret.Timer = new egret.Timer(2000, 1);
    private qiqiuBomb: egret.MovieClip;
    private isBombWolf: boolean = false;
    public speed: number = 1;
    public constructor() {
        super();
        this.init();
    }
    private init(): void {
        var wolfData = RES.getRes("wolf_json");
        var wolfPng = RES.getRes("wolf_png");
        var mcDataFactory = new egret.MovieClipDataFactory(wolfData, wolfPng);
        this.wolf = new egret.MovieClip(mcDataFactory.generateMovieClipData("wolf"));
        this.addChild(this.wolf);

        var balloonData = RES.getRes("balloon_json");
        var balloonPng = RES.getRes("balloon_png");
        var mcDataFactory = new egret.MovieClipDataFactory(balloonData, balloonPng);
        this.qiqiuBomb = new egret.MovieClip(mcDataFactory.generateMovieClipData("balloon"));
        this.addChild(this.qiqiuBomb);
        this.qiqiuBomb.x = 20;
        this.qiqiuBomb.visible = false;



        this.qiqiu = new egret.Bitmap(RES.getRes("qiqiu_png"));
        this.addChild(this.qiqiu);
        this.wolfQiqiui = new egret.Bitmap(RES.getRes("lang_png"));
        this.addChild(this.wolfQiqiui);
        this.wolfQiqiui.y = 40;

        this.qiqiu.visible = false;
        this.wolfQiqiui.visible = false;

        this.wolfDead = new egret.Bitmap(RES.getRes("langDie_png"));
        this.addChild(this.wolfDead);
        this.wolfDead.y = 40;
        this.wolfDead.visible = false;

        this.timeFire.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onFire, this);
        this.qiqiuBomb.addEventListener(egret.Event.LOOP_COMPLETE, this.qiqiuiComplete, this);
    }
    private onFire(): void {
        Main.battleLayer.onBombFire(new egret.Point(this.x, this.y));
    }
    private qiqiuiComplete(): void {
        this.qiqiuBomb.stop();
        this.state = 2; //更换状态
        this.qiqiuBomb.visible = false;
        this.wolfQiqiui.visible = false;
        this.wolfDead.visible = true;
        this.timeFire.stop();
    }
    public beginRun(): void {
        var tempX: number = Math.floor(Math.random() * 4);
        this.destPointX = this.destPointArray[tempX];
        this.x = 500;
        this.y = 35;
        this.wolf.visible = true;
        this.wolf.play(-1);
        this.qiqiu.visible = false;
        this.wolfQiqiui.visible = false;
        this.wolfDead.visible = false;
        this.state = 0;
        this.qiqiuBomb.visible = false;

        if (Math.round(Math.random() * 100)>60)
        {
            this.isBombWolf = true;
        }

    }


    public logic(): void {
        if (this.state == 0) {
            if (this.x > this.destPointX) {
                this.x -= 3;
            } else {
                this.x = this.destPointX;
                this.state = 1;
                this.wolf.visible = false;
                this.qiqiu.visible = true;
                this.wolfQiqiui.visible = true;
                if (this.isBombWolf == true) {
                    this.timeFire.delay = Math.round(Math.random() * 2000) + 1000;
                    this.timeFire.reset();
                    this.timeFire.start();
                }

            }
        } else if (this.state == 1) {
            this.y += this.speed;
            if (this.y >= 650) {
                this.state = 4;
                this.wolf.visible = true;
                this.wolf.play(-1);
                this.qiqiu.visible = false;
                this.wolfQiqiui.visible = false;
                this.wolfDead.visible = false;
                this.qiqiuBomb.visible = false;
                this.y = 685;
            }
        } else if (this.state == 2) {
            this.y += 5;
            if (this.y >= 650) {
                this.disPose();
            }

        } else if (this.state == 4) {
            this.x -= 3;
            if (this.x < 70) {
                this.state = 5;
                this.wolf.stop();
                if (Main.battleLayer.wolfUpY == 0)
                {       
                    Main.battleLayer.wolfUpY -= 48;
                 }else
                 {       
                     this.y += Main.battleLayer.wolfUpY;
                     Main.battleLayer.wolfUpY -= 48;
                 }

            } 
        } 




    }
    public disPose(): void {
        this.state = 3;
        this.wolf.stop();
        this.parent.removeChild(this);
        if (this.timeFire.running == true)
        {
            this.timeFire.stop();
        }
        this.isBombWolf = false;

    }
    //判断是否被射中
    public isBeHit(arrow: egret.Bitmap): void {
        var b: boolean = this.qiqiu.hitTestPoint((arrow.width+arrow.x), arrow.y);
        if (b == true) { //射中      
            arrow.visible = false;
            this.qiqiu.visible = false;       
            this.qiqiuBomb.visible = true;
            this.qiqiuBomb.gotoAndPlay(0, -1);
            return;
        }
        var c :boolean = this.wolfQiqiui.hitTestPoint((arrow.width + arrow.x), arrow.y);
        if (c == true) { //射中狼      
            arrow.rotation = 90;
        }
       
  
    }


}