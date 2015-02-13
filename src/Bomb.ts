class Bomb extends egret.Sprite {
    private bomb: egret.Bitmap;
    private destPos: egret.Point;
    private startPos: egret.Point;
    public running: boolean = false;
    private speedX: number = 5;
    private speedY: number = 0;

    public constructor() {
        super();
        this.bomb= new egret.Bitmap();
        this.bomb.texture = RES.getRes("boom_png");
        this.addChild(this.bomb);
    }
    public setDestPos(pos:egret.Point): void {
        this.destPos = pos;
    }
    public setStartPos(pos: egret.Point): void {
        this.startPos = pos;
        this.x = this.startPos.x;
        this.y = this.startPos.y;
    }
    public compute(): void {
        var dis: number = Math.abs(this.startPos.x - this.destPos.x);
        var steps: number = Math.floor(dis / this.speedX);
        this.speedY = (this.destPos.y - this.startPos.y)/steps;

    }
    public onFire(): void {
        this.running = true;
    }

    public logic(): void {
        if (this.running == false) return;
        this.x -= this.speedX;  
        this.y += this.speedY;   

        if (this.x <= this.destPos.x-100) {
            this.running = false;
            if (this.parent != null && this.parent.contains(this)==true)
            {
                this.parent.removeChild(this);
            }

        }
    }
}